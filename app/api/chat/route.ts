import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/ai/prompts';
import { searchFoods } from '@/lib/food/search';
import { buildFoodCarousel, buildNoResultsMessage } from '@/lib/components/builders';

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

          // Extract search intent and perform search
          let filters: any = {};
          let searchQuery = userMessage.toLowerCase();

          // Extract filters from user message
          if (searchQuery.includes('vegetarian') || searchQuery.includes('veg')) {
            filters.type = 'Vegetarian';
          }
          if (
            searchQuery.includes('non-veg') ||
            searchQuery.includes('meat') ||
            searchQuery.includes('chicken') ||
            searchQuery.includes('fish')
          ) {
            filters.type = 'Non-Vegetarian';
          }
          if (searchQuery.includes('spicy') || searchQuery.includes('hot')) {
            filters.spiceLevel = 'Spicy';
          }
          if (searchQuery.includes('mild')) {
            filters.spiceLevel = 'Mild';
          }
          if (searchQuery.includes('high protein')) {
            filters.minProtein = 20;
          }
          if (searchQuery.includes('low carb')) {
            filters.maxCarbs = 20;
          }
          if (searchQuery.includes('low calorie')) {
            filters.maxCalories = 400;
          }

          // Perform search
          let searchResults = searchFoods(userMessage, filters, 6);

          // Fallback to popular items if no results
          if (searchResults.length === 0 || searchResults.every((r) => r.score === 0)) {
            searchResults = searchFoods('popular', {}, 6);
          }

          // Build JSON UI schema
          const foods = searchResults.map((r) => r.food);
          const componentSchema =
            foods.length > 0 ? buildFoodCarousel(foods) : buildNoResultsMessage();

          // Send final message with component schema
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
