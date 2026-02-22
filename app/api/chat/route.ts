import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/prompts';
import { searchFoods } from '@/lib/food/search';
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
          // First, ask LLM to analyze the intent
          const intentAnalysis = await openai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are an intent analyzer for a food ordering system. Analyze if the user's message requires showing food items/menu.

IMPORTANT: Only set showFood=true if the user is specifically asking about FOOD, MENU, or ORDERING. 

Return a JSON object with:
- showFood: boolean (true ONLY if user is asking about food, menu, recommendations, or wants to see food options)
- searchQuery: string (extract the food-related search terms, or empty string if not applicable)
- filters: object with optional fields:
  - type: "Vegetarian" | "Non-Vegetarian" | null
  - spiceLevel: "Mild" | "Medium" | "Spicy" | "Medium-Hot" | null
  - minProtein: number | null
  - maxCarbs: number | null
  - maxCalories: number | null

Examples:
- "hi" -> {"showFood": false, "searchQuery": "", "filters": {}}
- "hello" -> {"showFood": false, "searchQuery": "", "filters": {}}
- "how are you?" -> {"showFood": false, "searchQuery": "", "filters": {}}
- "I want to order mobile" -> {"showFood": false, "searchQuery": "", "filters": {}}
- "what's your address?" -> {"showFood": false, "searchQuery": "", "filters": {}}
- "what vegetarian options do you have?" -> {"showFood": true, "searchQuery": "vegetarian", "filters": {"type": "Vegetarian"}}
- "show me lunch options" -> {"showFood": true, "searchQuery": "lunch", "filters": {}}
- "I need something high protein low carb" -> {"showFood": true, "searchQuery": "high protein low carb", "filters": {"minProtein": 20, "maxCarbs": 20}}
- "show me your menu" -> {"showFood": true, "searchQuery": "popular", "filters": {}}
- "what do you have?" -> {"showFood": true, "searchQuery": "popular", "filters": {}}
- "I'm hungry" -> {"showFood": true, "searchQuery": "popular", "filters": {}}
- "recommend something" -> {"showFood": true, "searchQuery": "popular", "filters": {}}`,
              },
              {
                role: 'user',
                content: userMessage,
              },
            ],
            model: 'gpt-4o-mini',
            temperature: 0.3,
            response_format: { type: 'json_object' },
          });

          const intent = JSON.parse(intentAnalysis.choices[0]?.message?.content || '{}');

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

            // Perform search
            let searchResults = searchFoods(searchQuery, filters, 6);

            // Fallback to popular items if no results
            if (searchResults.length === 0 || searchResults.every((r) => r.score === 0)) {
              searchResults = searchFoods('popular', {}, 6);
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
