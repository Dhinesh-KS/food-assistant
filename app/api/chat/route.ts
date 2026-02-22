import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { searchFoods, getFoodsWithEmbeddings } from '@/lib/food';
import { buildFoodCarousel, buildNoResultsMessage, buildCartSummary } from '@/components/widgets/builders';
import { Food } from '@/types/food';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const maxDuration = 30;

// Helper function to detect cart operations and extract food items
async function detectCartOperation(userMessage: string, conversationHistory: any[]) {
  try {
    const cartDetection = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a cart operation detector. Analyze if the user wants to add SPECIFIC items to their cart.

Return JSON:
{
  "isCartOperation": boolean,
  "isAmbiguous": boolean, // true if request is vague (e.g., "pizza" without specifying which)
  "foodItems": string[], // Array of SPECIFIC food item names
  "quantity": number // Total quantity mentioned (default 1)
}

CRITICAL RULES:
1. If the request is AMBIGUOUS (generic category without specifics), set isAmbiguous=true and isCartOperation=false
2. Only set isCartOperation=true if the user mentions SPECIFIC dish names OR if they're confirming from previously shown options
3. Extract quantity if mentioned ("two pizzas" = quantity: 2)

AMBIGUOUS REQUESTS (isCartOperation=false, isAmbiguous=true):
- "Add a pizza to my cart" → Too vague, which pizza?
- "Add a large pizza" → Still vague, which type?
- "I want a burger" → Which burger?

SPECIFIC REQUESTS (isCartOperation=true, isAmbiguous=false):
- "Add the Grilled Chicken Breast to my cart" → Specific dish name
- "I'll take the Butter Chicken" → Specific dish name
- "Add two of those" → Referring to previously shown item (check context)
- "Yes, add it" → Confirming previously discussed item
- "Yes please" → Confirmation after agent suggested items (extract from context)
- "Sure" / "Yes" / "Okay" → Confirmation responses (check if agent asked about adding items)

EXAMPLES:

Input: "Add the Grilled Chicken Breast, Caesar Salad, and Orange Juice to my cart"
Output: {
  "isCartOperation": true,
  "isAmbiguous": false,
  "foodItems": ["Grilled Chicken Breast", "Caesar Salad", "Orange Juice"],
  "quantity": 1
}

Input: "I'll take the Butter Chicken and Garlic Naan"
Output: {
  "isCartOperation": true,
  "isAmbiguous": false,
  "foodItems": ["Butter Chicken", "Garlic Naan"],
  "quantity": 1
}

Input: "Add a large pizza to my cart"
Output: {
  "isCartOperation": false,
  "isAmbiguous": true,
  "foodItems": ["pizza"],
  "quantity": 1
}

Input: "Yes, add two of those"
Context: User was just shown "BBQ Chicken Pizza"
Output: {
  "isCartOperation": true,
  "isAmbiguous": false,
  "foodItems": ["BBQ Chicken Pizza"],
  "quantity": 2
}

Input: "What's in the Butter Chicken?"
Output: {
  "isCartOperation": false,
  "isAmbiguous": false,
  "foodItems": [],
  "quantity": 1
}

Input: "Show me salads"
Output: {
  "isCartOperation": false,
  "isAmbiguous": false,
  "foodItems": [],
  "quantity": 1
}

Input: "Yes please"
Context: Agent just asked "Should I add Palak Paneer and Garlic Naan?"
Output: {
  "isCartOperation": true,
  "isAmbiguous": false,
  "foodItems": ["Palak Paneer", "Garlic Naan"],
  "quantity": 1
}

Input: "Sure"
Context: Agent asked "Want to add it?" about BBQ Chicken Pizza
Output: {
  "isCartOperation": true,
  "isAmbiguous": false,
  "foodItems": ["BBQ Chicken Pizza"],
  "quantity": 1
}`,
        },
        {
          role: 'user',
          content: `Conversation context:
${conversationHistory.slice(-3).map((m: any) => `${m.role}: ${m.content}`).join('\n')}

Current message: "${userMessage}"

If the user is referencing something from context (like "those", "it", "that"), extract the actual item name from the conversation history.`,
        },
      ],
      model: 'gpt-4o-mini',
      temperature: 0.0,
      response_format: { type: 'json_object' },
    });

    return JSON.parse(cartDetection.choices[0]?.message?.content || '{"isCartOperation": false, "isAmbiguous": false, "foodItems": [], "quantity": 1}');
  } catch (error) {
    console.error('Cart detection error:', error);
    return { isCartOperation: false, isAmbiguous: false, foodItems: [], quantity: 1 };
  }
}

// Helper function to find food items by name
function findFoodsByNames(foodNames: string[]): Food[] {
  const allFoods = getFoodsWithEmbeddings();
  const foundFoods: Food[] = [];

  for (const name of foodNames) {
    const nameLower = name.toLowerCase();
    
    // Try exact match first
    let food = allFoods.find(f => f.name.toLowerCase() === nameLower);
    
    // Try partial match
    if (!food) {
      food = allFoods.find(f => 
        f.name.toLowerCase().includes(nameLower) || 
        nameLower.includes(f.name.toLowerCase())
      );
    }
    
    // Try searching in description
    if (!food) {
      food = allFoods.find(f => 
        f.description.toLowerCase().includes(nameLower)
      );
    }
    
    if (food) {
      foundFoods.push(food);
    }
  }

  return foundFoods;
}

export async function POST(req: Request) {
  try {
    const { messages, currentCart } = await req.json();
    const userMessage = messages[messages.length - 1]?.content || '';

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Enhanced intent analysis with ambiguity detection
          const intentAnalysis = await openai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are an intent analyzer for a food ordering system. Your PRIMARY goal is to show food items whenever possible.

CRITICAL RULES:
1. Count the number of specific requirements in the query. If there are 2 or more, ALWAYS set isAmbiguous=false and showFood=true.
2. If user asks "what X do you have?" or "I'd like X" where X is a specific food category, ALWAYS set showFood=true.
3. If user mentions specific food items (salad, juice, pizza, etc.), ALWAYS set showFood=true.
4. If user asks "What's in X?" or "What does X have?" (ingredient questions), set showFood=false and isAmbiguous=false - they want details, not food cards.

Specific requirements include:
- Protein type (chicken, paneer, fish, lamb, etc.)
- Dietary constraints (high protein, low carb, low calorie, etc.)
- Meal type (lunch, dinner, breakfast, snack)
- Cuisine (North Indian, South Indian, Continental, etc.)
- Spice level (mild, medium, spicy)
- Dish type (curry, salad, pizza, burger, juice, etc.)
- Dietary preference (vegetarian, non-vegetarian)

Return JSON:
{
  "showFood": boolean,
  "isAmbiguous": boolean,
  "clarificationQuestion": string | null,
  "searchQuery": string,
  "filters": {
    "type": "Vegetarian" | "Non-Vegetarian" | null,
    "spiceLevel": "Mild" | "Medium" | "Spicy" | null,
    "category": string | null,
    "minProtein": number | null,
    "maxCarbs": number | null,
    "maxCalories": number | null
  }
}

DECISION TREE:

1. Count specific requirements in query
   - 0-1 requirements AND very generic (just "pizza", "breakfast") → isAmbiguous=true, showFood=false
   - 2+ requirements → isAmbiguous=false, showFood=true (ALWAYS!)
   - 1 requirement but specific dish name → isAmbiguous=false, showFood=true
   - Questions like "what X do you have?" where X is specific → isAmbiguous=false, showFood=true
   - Requests like "I'd like X" or "I want X" where X is specific → isAmbiguous=false, showFood=true

2. Examples with requirement count:

"I need something for lunch, chicken-based, high protein, low carb"
→ Requirements: [lunch, chicken, high protein, low carb] = 4 requirements
→ isAmbiguous=false, showFood=true

"chicken-based, high protein, low carb"
→ Requirements: [chicken, high protein, low carb] = 3 requirements
→ isAmbiguous=false, showFood=true

"vegetarian North Indian"
→ Requirements: [vegetarian, North Indian] = 2 requirements
→ isAmbiguous=false, showFood=true

"butter chicken"
→ Requirements: [specific dish name] = 1 but specific
→ isAmbiguous=false, showFood=true

"I want pizza"
→ Requirements: [pizza] = 1 generic category
→ isAmbiguous=true, showFood=false

"vegetarian options"
→ Requirements: [vegetarian] = 1 generic
→ isAmbiguous=true, showFood=false

"hi" or "hello"
→ Requirements: 0
→ isAmbiguous=false, showFood=false

"what salad you have?"
→ Requirements: [salad] = 1 specific category + question format
→ isAmbiguous=false, showFood=true (user wants to see salads!)

"I'd like a salad and juice"
→ Requirements: [salad, juice] = 2 specific items
→ isAmbiguous=false, showFood=true

EXAMPLES:

Input: "I need something for lunch, chicken-based, high protein, low carb"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "chicken high protein low carb lunch",
  "filters": {"minProtein": 25, "maxCarbs": 20}
}

Input: "chicken high protein low carb"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "chicken high protein low carb",
  "filters": {"minProtein": 25, "maxCarbs": 20}
}

Input: "vegetarian North Indian"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "vegetarian North Indian",
  "filters": {"type": "Vegetarian", "category": "North Indian"}
}

Input: "butter chicken"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "butter chicken",
  "filters": {}
}

Input: "I want pizza"
Output: {
  "showFood": false,
  "isAmbiguous": true,
  "clarificationQuestion": "Great! We have several pizzas. Would you prefer vegetarian or non-vegetarian?",
  "searchQuery": "pizza",
  "filters": {}
}

Input: "vegetarian options"
Output: {
  "showFood": false,
  "isAmbiguous": true,
  "clarificationQuestion": "We have lots of vegetarian options! What type of cuisine are you in the mood for?",
  "searchQuery": "vegetarian",
  "filters": {"type": "Vegetarian"}
}

Input: "hi"
Output: {
  "showFood": false,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "",
  "filters": {}
}

Input: "what salad you have?"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "salad",
  "filters": {}
}

Input: "I'd like a salad and juice"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "salad juice",
  "filters": {}
}

Input: "what juices do you have?"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "juice",
  "filters": {}
}

Input: "What's in the BBQ Chicken pizza?"
Output: {
  "showFood": false,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "BBQ Chicken pizza ingredients",
  "filters": {}
}`,
              },
              {
                role: 'user',
                content: `Current query: "${userMessage}"

Count the specific requirements and decide accordingly.`,
              },
            ],
            model: 'gpt-4o-mini',
            temperature: 0.0,
            response_format: { type: 'json_object' },
          });

          const intent = JSON.parse(intentAnalysis.choices[0]?.message?.content || '{}');

          // Check if this is a cart operation (add to cart)
          const cartOperation = await detectCartOperation(userMessage, messages);
          
          // If it's an ambiguous cart request, treat it as a regular query to show options
          if (cartOperation.isAmbiguous) {
            // Override intent to show food options instead of adding to cart
            intent.showFood = true;
            intent.isAmbiguous = false;
            intent.searchQuery = cartOperation.foodItems.join(' ');
            // Don't process as cart operation - fall through to show food
          } else if (cartOperation.isCartOperation && cartOperation.foodItems.length > 0) {
            // Find the actual food items
            const foodsToAdd = findFoodsByNames(cartOperation.foodItems);
            
            if (foodsToAdd.length > 0) {
              // Use the quantity from detection (default 1)
              const quantity = cartOperation.quantity || 1;
              
              // Get current cart items from request (if any)
              const existingCartItems = currentCart || [];
              
              // Create new items to add
              // If multiple items mentioned, quantity applies to first item only, others get 1
              const newItems = foodsToAdd.map((food, index) => ({
                food,
                quantity: index === 0 ? quantity : 1, // First item gets detected quantity, rest get 1
              }));
              
              // Merge with existing cart - combine quantities for same items
              const mergedCartMap = new Map();
              
              // Add existing items
              existingCartItems.forEach((item: any) => {
                mergedCartMap.set(item.food.id, item);
              });
              
              // Add/update new items
              newItems.forEach(item => {
                const existing = mergedCartMap.get(item.food.id);
                if (existing) {
                  mergedCartMap.set(item.food.id, {
                    food: item.food,
                    quantity: existing.quantity + item.quantity,
                  });
                } else {
                  mergedCartMap.set(item.food.id, item);
                }
              });
              
              // Convert back to array
              const allCartItems = Array.from(mergedCartMap.values());
              
              // Calculate total for all items
              const total = allCartItems.reduce((sum, item) => sum + (item.food.price * item.quantity), 0);
              
              // Generate response message - show what was just added
              const addedItemsList = newItems.map(item => {
                if (item.quantity > 1) {
                  return `• ${item.food.name} (${item.quantity}) - ₹${item.food.price} each`;
                }
                return `• ${item.food.name} - ₹${item.food.price}`;
              }).join('\n');
              
              const responseMessage = quantity > 1 
                ? `Great choice! I've added the following to your cart:\n\n${addedItemsList}\n\nTotal: ₹${total}\n\nWould you like to add anything else or checkout?`
                : `Perfect! I've added the following to your cart:\n\n${addedItemsList}\n\nTotal: ₹${total}\n\nWould you like to checkout or continue browsing?`;
              
              // Stream the response
              for (const char of responseMessage) {
                const data = JSON.stringify({ type: 'text', content: char });
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                await new Promise(resolve => setTimeout(resolve, 10));
              }
              
              // Build cart summary component with ALL items (full cart state)
              const cartSummary = buildCartSummary(allCartItems, total);
              
              // Send done with cart summary component
              // Send each item with its specific quantity
              const doneData = JSON.stringify({
                type: 'done',
                message: responseMessage,
                component: cartSummary,
                cartItems: newItems.map(item => ({ foodId: item.food.id, quantity: item.quantity })), // Send each item with correct quantity
              });
              controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
              controller.close();
              return;
            }
          }

          // Handle ambiguous queries - ask clarifying questions first
          if (intent.isAmbiguous && intent.clarificationQuestion) {
            // Generate a conversational response with the clarification
            const clarificationResponse = await openai.chat.completions.create({
              messages: [
                {
                  role: 'system',
                  content: SYSTEM_PROMPT,
                },
                ...messages,
              ],
              model: 'gpt-4o-mini',
              temperature: 0.7,
              max_tokens: 200,
            });

            const clarificationText = clarificationResponse.choices[0]?.message?.content || intent.clarificationQuestion;
            
            // Stream the clarification question
            for (const char of clarificationText) {
              const data = JSON.stringify({ type: 'text', content: char });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              await new Promise(resolve => setTimeout(resolve, 10));
            }

            // Send done without component (no food cards yet!)
            const doneData = JSON.stringify({
              type: 'done',
              message: clarificationText,
              component: null,
            });
            controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));
            controller.close();
            return;
          }

          // Stream AI response
          const completion = await openai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: SYSTEM_PROMPT,
              },
              ...messages,
            ],
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 1024,
            stream: true,
          });

          let fullMessage = '';

          // Stream text chunks
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullMessage += content;
              const data = JSON.stringify({ type: 'text', content });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }

          // Use LLM's decision to show food or not
          let componentSchema = null;

          if (intent.showFood) {
            // Use LLM-extracted search query and filters
            const searchQuery = intent.searchQuery || userMessage;
            const filters = intent.filters || {};

            // Extract context from previous messages
            const conversationContext = messages
              .slice(-4)
              .map((m: any) => {
                const keywords = m.content
                  .toLowerCase()
                  .match(/\b(vegetarian|non-vegetarian|spicy|mild|north indian|south indian|street food|healthy|protein|low carb|dessert|breakfast|lunch|dinner)\b/g);
                return keywords || [];
              })
              .flat();

            // Determine how many items to show based on query breadth
            // Broad queries (vegetarian options, what do you have) → 8 items
            // Specific queries (chicken dishes, pizza) → 4-6 items
            const isBroadQuery = userMessage.toLowerCase().includes('options') || 
                                 userMessage.toLowerCase().includes('what do you have') ||
                                 userMessage.toLowerCase().includes('show me') ||
                                 (filters.type && !searchQuery.includes('chicken') && !searchQuery.includes('pizza'));
            const limit = isBroadQuery ? 8 : 6;

            // Perform search with context
            let searchResults = await searchFoods(searchQuery, filters, limit, conversationContext);

            // Check if results are relevant (score threshold)
            const MIN_RELEVANCE_SCORE = 5; // Minimum score to consider results relevant
            const hasRelevantResults = searchResults.some((r) => r.score >= MIN_RELEVANCE_SCORE);

            // If no relevant results, search for fallback alternatives
            if (searchResults.length === 0 || !hasRelevantResults) {
              // Define fallback mappings for common items we don't have
              const fallbackMap: Record<string, string> = {
                'pizza': 'naan kulcha paratha flatbread',
                'burger': 'vada pav sandwich wrap',
                'pasta': 'noodles biryani rice',
                'sandwich': 'vada pav wrap roll',
                'fries': 'samosa pakora',
                'sushi': 'idli dosa',
                'taco': 'wrap roll',
              };

              // Try to find fallback based on search query
              const queryLower = searchQuery.toLowerCase();
              let fallbackQuery = '';
              
              for (const [key, value] of Object.entries(fallbackMap)) {
                if (queryLower.includes(key)) {
                  fallbackQuery = value;
                  break;
                }
              }

              // If we found a fallback, search for those items
              if (fallbackQuery) {
                searchResults = await searchFoods(fallbackQuery, {}, 6);
                
                // Show fallback results if they're relevant
                if (searchResults.length > 0 && searchResults.some((r) => r.score >= MIN_RELEVANCE_SCORE)) {
                  const foods = searchResults.map((r) => r.food);
                  componentSchema = buildFoodCarousel(foods);
                } else {
                  componentSchema = null;
                }
              } else {
                // No fallback found, show popular items
                searchResults = await searchFoods('popular chicken butter', {}, 6);
                const foods = searchResults.map((r) => r.food);
                componentSchema = buildFoodCarousel(foods);
              }
            } else {
              // Build JSON UI schema with relevant results
              const foods = searchResults.map((r) => r.food);
              componentSchema = buildFoodCarousel(foods);
            }
          }

          // Send final message with component schema (if any)
          const doneData = JSON.stringify({
            type: 'done',
            message: fullMessage,
            component: componentSchema,
          });
          controller.enqueue(encoder.encode(`data: ${doneData}\n\n`));

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            message: 'Sorry, I encountered an error. Please try again.',
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
