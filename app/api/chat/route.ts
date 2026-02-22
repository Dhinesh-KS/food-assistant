import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { searchFoods } from '@/lib/food';
import { buildFoodCarousel, buildNoResultsMessage } from '@/components/widgets/builders';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
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
                content: `You are an intent analyzer for a food ordering system. Analyze the user's query and determine:

1. Whether to show food items
2. Whether the query is ambiguous and needs clarification
3. What clarifying question to ask (if ambiguous)
4. Search parameters

Return JSON with this structure:
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
  },
  "contextNeeded": string[]
}

AMBIGUITY RULES:
- Query mentions general category without specifics → AMBIGUOUS
  Example: "pizza" → Need to ask about toppings, type
  Example: "breakfast" → Need to ask about preferences
  Example: "something spicy" → Need to ask about category
  Example: "vegetarian options" → Need to ask about cuisine type
  
- Query is specific enough → NOT AMBIGUOUS, SHOW FOOD
  Example: "butter chicken" → Specific dish
  Example: "vegetarian North Indian food" → Clear filters
  Example: "high protein low carb chicken" → Clear requirements
  Example: "coffee" → Specific item (we have Filter Coffee)
  Example: "lassi" → Specific beverage (we have Lassi and Mango Lassi)
  
- Query asks "do you have X" where X is specific → NOT AMBIGUOUS, SHOW FOOD
  Example: "do you have coffee" → Show coffee options
  Example: "do you have lassi" → Show lassi options

CONTEXT USAGE:
- Consider previous messages in the conversation
- If user mentioned "North Indian" before, don't ask again
- Build on previous context

Examples:

Input: "I want pizza"
Output: {
  "showFood": false,
  "isAmbiguous": true,
  "clarificationQuestion": "Great! We have several pizzas. Would you prefer vegetarian or non-vegetarian? Any topping preferences?",
  "searchQuery": "pizza",
  "filters": {},
  "contextNeeded": ["type", "toppings"]
}

Input: "Show me vegetarian options"
Output: {
  "showFood": false,
  "isAmbiguous": true,
  "clarificationQuestion": "We have lots of vegetarian options! What type of meal are you in the mood for - North Indian curries, South Indian specialties, street food, or something else?",
  "searchQuery": "vegetarian",
  "filters": {"type": "Vegetarian"},
  "contextNeeded": ["category"]
}

Input: "I need vegetarian North Indian food"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "vegetarian North Indian",
  "filters": {"type": "Vegetarian", "category": "North Indian"},
  "contextNeeded": []
}

Input: "I want butter chicken"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "butter chicken",
  "filters": {},
  "contextNeeded": []
}

Input: "hi"
Output: {
  "showFood": false,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "",
  "filters": {},
  "contextNeeded": []
}

Input: "do you have coffee"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "coffee",
  "filters": {},
  "contextNeeded": []
}

Input: "I want lassi"
Output: {
  "showFood": true,
  "isAmbiguous": false,
  "clarificationQuestion": null,
  "searchQuery": "lassi",
  "filters": {},
  "contextNeeded": []
}`,
              },
              {
                role: 'user',
                content: `Conversation history:
${messages.slice(-3).map((m: any) => `${m.role}: ${m.content}`).join('\n')}

Current query: "${userMessage}"`,
              },
            ],
            model: 'gpt-4o-mini',
            temperature: 0.3,
            response_format: { type: 'json_object' },
          });

          const intent = JSON.parse(intentAnalysis.choices[0]?.message?.content || '{}');

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

            // Perform search with context
            let searchResults = await searchFoods(searchQuery, filters, 6, conversationContext);

            // Fallback to popular items if no results
            if (searchResults.length === 0 || searchResults.every((r) => r.score === 0)) {
              searchResults = await searchFoods('popular', {}, 6);
            }

            // Build JSON UI schema
            const foods = searchResults.map((r) => r.food);
            componentSchema =
              foods.length > 0 ? buildFoodCarousel(foods) : buildNoResultsMessage();
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
