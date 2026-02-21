# 🎥 Loom Video Script

## Video Structure (3-5 minutes)

### Introduction (15 seconds)
"Hi! I'm going to walk you through my AI-powered food ordering system called Spice & Delight. This is a conversational ordering platform that uses AI to help customers discover and order food naturally."

### Part 1: Quick Overview (30 seconds)
- Show the README briefly
- "Built with Next.js, TypeScript, Groq AI, and Tailwind CSS"
- "Features 100+ food items with semantic search and dynamic UI"
- "Let me show you how to run it locally"

### Part 2: Setup Demo (45 seconds)
- Show terminal
- "First, install dependencies: npm install"
- Show .env.local file (blur the API key!)
- "Add your Groq API key here - it's free from console.groq.com"
- "Then run: npm run dev"
- "The app starts on localhost:3000"

### Part 3: User Experience Demo (2 minutes)

**Scenario 1: Simple Query (30 seconds)**
- Open the app
- "Let's start with a simple query"
- Type: "Show me vegetarian options"
- Show AI response and food cards appearing
- "Notice how it shows rich food cards with images, nutrition info, and prices"
- Click "Add to Cart" on one item
- "Items are added instantly with a toast notification"

**Scenario 2: Complex Query (30 seconds)**
- Type: "I need high protein, low carb meals"
- "The AI understands nutritional requirements"
- Show filtered results
- "All these items meet the criteria"
- Add one to cart

**Scenario 3: Multi-turn Conversation (30 seconds)**
- Type: "I want something spicy with chicken"
- Show AI response
- "The AI asks clarifying questions and provides context"
- Continue the conversation
- Add item to cart

**Scenario 4: Cart & Checkout (30 seconds)**
- Click cart icon
- "Here's the cart drawer with all items"
- Adjust quantity
- Remove an item
- "Notice the real-time total updates"
- Click "Proceed to Checkout"
- Fill form quickly
- Submit order
- "Order confirmed with estimated delivery time!"

### Part 4: Technical Implementation (1 minute)

**Show Code (30 seconds)**
- Open VS Code
- "Let me show you the key technical components"
- Show `app/api/chat/route.ts`
  - "This is the AI endpoint using Groq's Llama 3.1"
- Show `lib/food/search.ts`
  - "Smart search with scoring and filters"
- Show `components/chat/dynamic/FoodCard.tsx`
  - "Dynamic UI components rendered based on search results"

**Architecture (30 seconds)**
- Show file structure
- "Clean separation: API routes, components, lib utilities"
- "State management with Zustand for cart"
- "All TypeScript for type safety"
- Show Docker files
- "Docker support for easy deployment"

### Part 5: Product Thinking (30 seconds)
"Key product decisions I made:"
- "Hybrid approach: conversational + visual UI"
- "Multi-turn conversations for ambiguous queries"
- "Automatic filtering based on keywords"
- "Proactive suggestions for complementary items"
- "Mobile-first responsive design"

### Conclusion (15 seconds)
- Show deployed Vercel link (if available)
- "The app is deployed and ready to use"
- "Docker-compose makes local testing easy"
- "Thank you for watching!"

## 🎬 Recording Checklist

Before recording:
- ✅ Close unnecessary browser tabs
- ✅ Clear browser console
- ✅ Test all features work
- ✅ Prepare test queries
- ✅ Have VS Code ready with key files open
- ✅ Test microphone
- ✅ Clean desktop (hide personal info)

During recording:
- ✅ Speak clearly and at moderate pace
- ✅ Show, don't just tell
- ✅ Highlight key features
- ✅ Demonstrate smooth user flows
- ✅ Explain technical decisions

After recording:
- ✅ Watch the video
- ✅ Verify audio is clear
- ✅ Check all features were shown
- ✅ Get shareable link
- ✅ Test link works

## 📝 Key Points to Emphasize

1. **Product Thinking**
   - Why conversational interface solves real problems
   - Hybrid approach (chat + visual UI)
   - User-centric design decisions

2. **Technical Implementation**
   - Clean architecture
   - Type-safe TypeScript
   - Efficient search algorithm
   - Dynamic component rendering

3. **AI Integration**
   - Natural language understanding
   - Context retention
   - Clarifying questions
   - Groq for fast, free inference

4. **User Experience**
   - Smooth interactions
   - Rich visual components
   - Real-time updates
   - Mobile responsive

## 🎯 Time Management

- Introduction: 15s
- Setup: 45s
- User flows: 2m
- Technical: 1m
- Product thinking: 30s
- Conclusion: 15s
- **Total: ~4.5 minutes**

Keep it concise and engaging!
