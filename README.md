# 🍽️ Spice & Delight - AI-Powered Restaurant Ordering System

An intelligent food ordering platform that uses AI to help customers discover and order food through natural conversations. Built with Next.js, OpenAI, and modern web technologies with a JSON-based dynamic UI rendering system.

## ✨ Features

- **Conversational AI Assistant**: Chat naturally with an AI that understands your preferences and dietary requirements
- **Dynamic UI Components**: Rich, interactive food cards with images, nutrition info, and instant add-to-cart
- **Smart Search**: Semantic search across 100+ food items with filters for dietary preferences, spice levels, and nutrition
- **Multi-turn Conversations**: AI asks clarifying questions and suggests complementary items
- **Real-time Cart Management**: Add, remove, and modify items with live cart updates
- **Seamless Checkout**: Simple delivery form with Cash on Delivery
- **Mobile Responsive**: Beautiful UI that works on all devices
- **Docker Support**: Easy deployment with Docker and docker-compose

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)
- OpenAI API Key (get from https://platform.openai.com/api-keys)

### Option 1: Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd food-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Option 2: Docker (Recommended for Testing)

1. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Tech Stack

**Frontend & Backend:**
- Next.js 14 (App Router) - Fullstack framework
- React 18 - UI components
- TypeScript - Type safety
- Tailwind CSS - Styling
- Framer Motion - Animations

**AI & Intelligence:**
- OpenAI API - GPT-4o-mini with streaming responses
- JSON-based UI rendering - Backend constructs dynamic UI schemas
- Custom semantic search - Keyword-based search with scoring
- Context-aware conversations

**State Management:**
- Zustand - Cart state with persistence
- React hooks - Component state

**Deployment:**
- Vercel - Production hosting
- Docker - Containerization

### Project Structure

```
food-assistant/
├── app/
│   ├── layout.tsx              # Root layout with global styles
│   ├── page.tsx                # Main chat interface page
│   ├── globals.css             # Global CSS with Tailwind
│   └── api/
│       ├── chat/route.ts       # AI chat endpoint
│       └── order/route.ts      # Order placement endpoint
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx   # Main chat component
│   │   ├── ChatMessage.tsx     # Message bubble component
│   │   ├── MessageInput.tsx    # Chat input field
│   │   └── dynamic/
│   │       ├── FoodCard.tsx    # Interactive food card
│   │       ├── FoodGrid.tsx    # Grid layout for food items
│   │       ├── CartSummary.tsx # Cart display component
│   │       └── CheckoutForm.tsx # Checkout form
│   ├── layout/
│   │   ├── Header.tsx          # App header with branding
│   │   └── CartDrawer.tsx      # Slide-out cart drawer
│   └── ui/                     # Reusable UI components (buttons, cards, etc.)
├── lib/
│   ├── food/
│   │   ├── types.ts            # TypeScript interfaces
│   │   ├── index.ts            # Food data loader
│   │   └── search.ts           # Search and filter logic
│   ├── cart/
│   │   └── store.ts            # Zustand cart store
│   ├── ai/
│   │   └── prompts.ts          # AI system prompts
│   └── utils.ts                # Utility functions
├── resources/
│   ├── Foods.json              # 100+ food items with details
│   └── images/                 # Food images
├── public/                     # Static assets
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose setup
└── README.md                   # This file
```

## 🎯 Key Features Explained

### 1. Conversational AI

The AI assistant understands natural language queries and provides contextual responses:

- **Dietary Filters**: "Show me vegetarian options" or "I need high protein meals"
- **Cuisine Preferences**: "What Indian dishes do you have?" or "Something with chicken"
- **Nutritional Requirements**: "Low carb options" or "Under 400 calories"
- **Clarifying Questions**: AI asks follow-ups when requests are ambiguous

### 2. Dynamic UI Components

Instead of plain text responses, the chat displays rich, interactive components:

- **Food Cards**: Beautiful cards with images, descriptions, nutrition facts, and add-to-cart buttons
- **Cart Summary**: Live cart updates with quantity adjusters and remove buttons
- **Checkout Form**: Integrated delivery form within the chat flow

### 3. Smart Search

The search system uses multiple scoring factors:
- Exact name matches (highest priority)
- Description relevance
- Category matching
- Ingredient matching
- Keyword frequency

Filters include:
- Dietary type (Vegetarian/Non-Vegetarian)
- Spice level (Mild/Medium/Spicy/Very Spicy)
- Nutrition ranges (calories, protein, carbs)
- Price range
- Category

### 4. Cart Management

- Persistent cart state (survives page refreshes)
- Quantity adjustments
- Item removal
- Real-time total calculation with tax and delivery fees
- Free delivery on orders over ₹500

## 💡 Product Thinking & Design Decisions

### Why Conversational Interface?

Traditional e-commerce interfaces suffer from:
- **Choice paralysis**: 100+ items is overwhelming
- **Complex filters**: Multiple checkboxes and dropdowns
- **Poor discovery**: Hard to find what you want

Our conversational approach solves these by:
- **Guided discovery**: AI narrows down options through dialogue
- **Natural language**: "High protein, low carb" vs. setting multiple filters
- **Contextual suggestions**: AI recommends complementary items
- **Clarification**: Multi-turn conversations handle ambiguity

### Dynamic UI Strategy

We combine the best of both worlds:
- **Conversational**: Natural language interaction
- **Visual**: Rich UI components for browsing and selection
- **Interactive**: Direct manipulation (add to cart, adjust quantity)

This hybrid approach is more effective than pure text chat or traditional UI alone.

### AI Implementation

**Why OpenAI GPT-4o-mini?**
- Free tier with generous limits
- Fast inference (< 1 second response time)
- Good reasoning for multi-turn conversations
- No API costs for development and testing

**Conversation Design:**
- System prompt engineered for restaurant context
- Conversational and friendly tone
- Proactive suggestions
- Context retention across messages

## 🧪 Testing the Application

### Sample Queries to Try

1. **Dietary Preferences**
   - "Show me vegetarian options"
   - "I need high protein meals"
   - "What do you have that's low in carbs?"

2. **Cuisine Exploration**
   - "What North Indian dishes do you have?"
   - "Show me some desserts"
   - "I want something with chicken"

3. **Specific Requirements**
   - "I need lunch for two people"
   - "Something spicy"
   - "Under 400 calories"

4. **Multi-item Orders**
   - "I want butter chicken with naan and a drink"
   - "Add a large pizza and some sides"

5. **Clarification Scenarios**
   - "I want pizza" (AI will ask about size, toppings)
   - "Something healthy" (AI will ask for preferences)

## 📦 Deployment

### Vercel Deployment (Recommended)

1. **Create GitHub Repository**
   - Go to [github.com](https://github.com) and create a new repository
   - Follow GitHub's instructions to push your code

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next
   - Add environment variable:
     - Name: `OPENAI_API_KEY`
     - Value: Your OpenAI API key from https://platform.openai.com/api-keys
   - Click "Deploy"

3. **Access your app**
   Your app will be live at `https://your-app.vercel.app`

### Alternative: Manual Git Setup

If you prefer to set up git manually:

```bash
git init
git add .
git commit -m "Initial commit: AI-powered food ordering system"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Docker Deployment

For production Docker deployment:

```bash
docker build -t food-assistant .
docker run -p 3000:3000 -e OPENAI_API_KEY=your_key food-assistant
```

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | API key from OpenAI Platform | Yes |

Get your OpenAI API key at: https://platform.openai.com/api-keys

## 📱 User Flow

1. **Landing**: User sees welcome screen with quick action buttons
2. **Query**: User asks about food (text or quick action)
3. **AI Response**: AI shows relevant food cards and asks clarifying questions
4. **Refinement**: Multi-turn conversation to narrow down choices
5. **Selection**: User adds items to cart via buttons on food cards
6. **Cart Review**: User opens cart drawer to review and modify
7. **Checkout**: User fills delivery form
8. **Confirmation**: Order confirmed with estimated delivery time

## 🎨 Design Philosophy

**Conversational Commerce**: The chat isn't just a gimmick—it solves real problems:
- Discovery paralysis with 100+ items
- Complex dietary requirements
- Meal planning and pairings
- Ambiguity handling through dialogue

**Visual + Conversational**: Best of both worlds:
- Natural language for queries
- Rich UI for browsing and selection
- Direct manipulation for cart operations

## 🔍 Technical Highlights

### Performance Optimizations

- **Fast Search**: In-memory search with < 50ms response time
- **Image Optimization**: Next.js Image component with lazy loading
- **Efficient State**: Zustand for minimal re-renders
- **Code Splitting**: Automatic with Next.js App Router

### Error Handling

- Graceful API error handling
- Image fallbacks for missing images
- User-friendly error messages
- Retry mechanisms

### Mobile Responsiveness

- Responsive grid layouts
- Touch-friendly buttons
- Optimized for small screens
- Slide-out cart drawer

## 🐛 Troubleshooting

### Build Issues

**Problem**: Build fails with module not found
```bash
npm install
npm run build
```

**Problem**: TypeScript errors
```bash
rm -rf .next
npm run build
```

### Runtime Issues

**Problem**: Images not loading
- Check that `resources/images/` folder exists
- Verify images are copied to `public/images/`

**Problem**: Chat not responding
- Verify `OPENAI_API_KEY` is set in `.env.local`
- Check API key is valid at https://console.groq.com
- Check browser console for errors

**Problem**: Cart not persisting
- Check browser localStorage is enabled
- Clear localStorage and refresh if corrupted

### Docker Issues

**Problem**: Docker build fails
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

**Problem**: Port 3000 already in use
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"
```

## 🎯 Future Enhancements

- User authentication and profiles
- Order history tracking
- Traditional browse view alongside chat
- Favorites and saved items
- Real-time order tracking
- Admin dashboard for restaurant
- Payment gateway integration
- Multi-restaurant support
- Reviews and ratings
- Loyalty program

## 📄 License

This project is created as an assignment submission.

## 🙏 Acknowledgments

- Food data and images provided as part of the assignment
- Built with Next.js, OpenAI, and modern web technologies
- UI components inspired by shadcn/ui

---

**Built with ❤️ for the Full-Stack Engineer Assignment**
