# 🍽️ Spice & Delight - AI-Powered Restaurant Ordering System

An intelligent food ordering platform that uses AI to help customers discover and order food through natural conversations. Built with Next.js, OpenAI, and modern web technologies featuring an innovative **JSON-based dynamic UI rendering system**.

## ✨ Key Features

- **JSON-Based UI Rendering** - Backend generates UI as structured schemas, frontend dynamically renders React components
- **AI-Powered Conversations** - Multi-turn dialogues with context retention and intelligent clarifications
- **Hybrid Search Engine** - Keyword matching + semantic understanding for accurate food discovery
- **Server-Sent Events** - Real-time streaming responses for better perceived performance
- **Production-Ready** - Docker support, TypeScript, error handling, and comprehensive documentation

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Setup Guide](./docs/SETUP.md)** - Detailed installation instructions, prerequisites, and environment setup
- **[Docker Guide](./docs/DOCKER.md)** - Docker deployment, development setup, and troubleshooting
- **[Architecture](./docs/ARCHITECTURE.md)** - System design, technology choices, and architectural decisions
- **[JSON Rendering](./docs/JSON_RENDERING.md)** - Deep dive into our JSON-based dynamic UI system
- **[AI Approach](./docs/AI_APPROACH.md)** - AI implementation, prompt engineering, and conversation design
- **[Features](./docs/FEATURES.md)** - Complete feature list with technical implementation details
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and solutions

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Docker** and Docker Compose (optional, for containerized deployment)
- **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)

### Option 1: Local Development (Recommended)

```bash
# 1. Clone the repository
git clone
cd food-assistant

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key

# 4. Run the development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

### Option 2: Docker (One Command Setup)

```bash
# 1. Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key

# 2. Build and run (production)
docker-compose up --build

# Or for development with hot reload
docker-compose -f docker-compose.dev.yml up --build

# 3. Open http://localhost:3000 in your browser
```

> **Need help?** See the [Setup Guide](./docs/SETUP.md) or [Docker Guide](./docs/DOCKER.md) for detailed instructions.

## 🏗️ Architecture Overview

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14, React 18, TypeScript | Full-stack framework with SSR |
| **Styling** | Tailwind CSS, Framer Motion | Utility-first CSS, animations |
| **AI** | OpenAI GPT-4o-mini | Natural language understanding |
| **State** | Zustand | Cart management with persistence |
| **Deployment** | Vercel, Docker | Production hosting, containerization |

## 🎯 Assumptions & Design Choices

### Assumptions Made

1. **Food Data is Static** - Menu doesn't change frequently, so file-based storage is sufficient
2. **Single Restaurant** - Not multi-tenant, simplifies architecture
3. **Cash on Delivery** - No payment gateway integration needed
4. **Session-Based Cart** - No user accounts required for basic functionality
5. **English Only** - No internationalization needed for MVP
6. **100+ Items** - Scale is manageable without database or vector search

### Key Design Choices

1. **Monolithic over Microservices** - Simpler for current scale, can split later
2. **OpenAI over Open-Source** - Better quality, easier integration, worth the cost
3. **File Storage over Database** - Faster development, sufficient for read-only data
4. **Keyword Search over Vector** - Instant results, good enough for 100 items
5. **SSE over WebSockets** - Simpler implementation, sufficient for one-way streaming
6. **Zustand over Redux** - Minimal boilerplate, perfect for cart state

> **Rationale**: Each choice documented in [ARCHITECTURE.md](./docs/ARCHITECTURE.md) with trade-offs explained.

## 🎯 JSON-Based UI Rendering

One of the most innovative features of this application is the **JSON-based dynamic UI rendering system**.

### How It Works

**Traditional Approach:**
```
AI: "Here are some options: 1. Butter Chicken - ₹399, 2. Paneer Tikka - ₹299"
```

**Our Approach:**
```json
{
  "type": "Carousel",
  "children": [
    {
      "type": "Card",
      "children": [
        { "type": "Image", "props": { "src": "/images/butter-chicken.jpg" } },
        { "type": "Title", "props": { "text": "Butter Chicken" } },
        { "type": "Button", "props": { "text": "Add to Cart", "action": {...} } }
      ]
    }
  ]
}
```

The frontend dynamically renders this JSON as interactive React components.

> **Deep Dive**: Read [JSON_RENDERING.md](./docs/JSON_RENDERING.md) for implementation details and pros/cons.

### Project Structure

```
food-assistant/
├── app/              # Next.js App Router - pages, layouts, and API routes
├── components/       # Reusable React components (widgets, layout, theme, ui)
├── views/            # Feature-based view components (chat, browse, cart, history)
├── lib/              # Core business logic (food search, AI prompts, utilities)
├── store/            # Zustand state management (cart, conversation, orders)
├── types/            # TypeScript type definitions (component schemas, food, chat)
├── hooks/            # Custom React hooks
├── resources/        # Static data (Foods.json with 100+ items)
├── public/           # Static assets (images, icons)
├── docs/             # Comprehensive documentation
└── middleware.ts     # Next.js middleware (auth, routing)
```

**Folder Roles:**

- **`app/`** - Next.js 14 App Router with file-based routing, page components, and API endpoints
- **`components/`** - Reusable UI building blocks including the JSON-based dynamic widget system ⭐
- **`views/`** - Feature-specific page views with complex logic (chat interface, browse, cart, history)
- **`lib/`** - Core business logic: food search engine, AI prompt engineering, and shared utilities
- **`store/`** - Global state management using Zustand with localStorage persistence
- **`types/`** - Centralized TypeScript type definitions ensuring type safety across the app
- **`hooks/`** - Custom React hooks for shared component logic
- **`resources/`** - Static data files including the complete food menu with nutrition information
- **`docs/`** - Detailed documentation covering setup, architecture, features, and troubleshooting

## 🤖 AI Implementation

The application uses **OpenAI GPT-4o-mini** for natural language understanding, intent analysis, and conversational responses. The AI handles multi-turn conversations, asks clarifying questions, and generates dynamic UI components based on user queries.

**Conversation Flow:**
```
User Query → Intent Analysis → Search/Filter → Response Generation → UI Schema → Stream to Client
```

> **Deep Dive**: Read [AI_APPROACH.md](./docs/AI_APPROACH.md) for detailed prompt engineering, conversation design, and optimization strategies.

## 🧪 Testing the Application

### Sample Queries to Try

**Basic Queries:**
```
"Show me vegetarian options"
"I need high protein meals"
"What desserts do you have?"
"Something spicy with chicken"
```

**Complex Queries:**
```
"I need chicken-based lunch, high protein, low carb"
"Show me North Indian vegetarian dishes under 400 calories"
"What do you have that's mild and serves 2 people?"
```

**Multi-Turn Conversations:**
```
You: "I want pizza"
AI: "We have several pizzas! Would you prefer vegetarian or non-vegetarian?"
You: "Vegetarian"
AI: [Shows vegetarian pizzas]
You: "Add the Margherita"
AI: "Added! Would you like drinks with that?"
```

**Cart Operations:**
```
"Add Butter Chicken to my cart"
"I'll take two large pizzas"
"Add it" (referring to previously shown item)
"Yes please" (confirming AI suggestion)
```

### Expected Behavior

✅ AI shows rich food cards with images
✅ Nutrition info displayed clearly
✅ Add to cart buttons work instantly
✅ Cart updates in real-time
✅ AI asks clarifying questions when needed
✅ Suggestions for complementary items
✅ Smooth animations and transitions

## 🚢 Deployment

### Vercel (Recommended for Production)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main

# 2. Deploy to Vercel
# - Go to vercel.com
# - Import your GitHub repository
# - Add environment variable: OPENAI_API_KEY
# - Deploy!
```

Your app will be live at `https://your-app.vercel.app`

### Docker (Production)

```bash
# Build image
docker build -t food-assistant .

# Run container
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key food-assistant
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (optional) | No |
| `CLERK_SECRET_KEY` | Clerk auth (optional) | No |

> **Security Note**: Never commit `.env.local` or `.env` files to version control.

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Port 3000 in use** | `lsof -ti:3000 \| xargs kill -9` or use `PORT=3001 npm run dev` |
| **OpenAI API key not found** | Check `.env.local` exists and contains `OPENAI_API_KEY=sk-...` |
| **Images not loading** | Verify images are in `public/images/` and paths are correct |
| **Chat not responding** | Check browser console, verify API key, check OpenAI status |
| **Module not found** | `rm -rf node_modules package-lock.json && npm install` |
| **Docker build fails** | `docker system prune -a && docker-compose up --build` |

> **Need more help?** See the comprehensive [Troubleshooting Guide](./docs/TROUBLESHOOTING.md) for detailed solutions.
