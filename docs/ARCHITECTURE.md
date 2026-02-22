# Architecture & Design Decisions

This document explains the architectural decisions, technical choices, and design rationale behind the Spice & Delight food ordering system.

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Patterns](#architecture-patterns)
4. [Key Design Decisions](#key-design-decisions)
5. [Data Flow](#data-flow)
6. [Component Architecture](#component-architecture)

---

## System Overview

Spice & Delight is a full-stack, AI-powered food ordering platform built as a single Next.js application. The architecture follows a modern, serverless approach with clear separation between client and server concerns.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Chat View    │  │ Browse View  │  │  Cart View   │      │
│  │ (AI-powered) │  │ (Traditional)│  │  (Checkout)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                  │              │
│           └────────────────┴──────────────────┘              │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │  API Routes    │
                    │  (Next.js)     │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼─────┐      ┌─────▼──────┐     ┌─────▼──────┐
   │ OpenAI   │      │   Search   │     │   Cart     │
   │   API    │      │   Engine   │     │  Manager   │
   └──────────┘      └────────────┘     └────────────┘
                            │
                     ┌──────▼──────┐
                     │  Food Data  │
                     │ (JSON/FS)   │
                     └─────────────┘
```

---

## Technology Stack

### Frontend

**Next.js 14 (App Router)**
- **Why**: Full-stack framework with built-in SSR, API routes, and excellent DX
- **Benefits**: 
  - File-based routing
  - Server and client components
  - Built-in API routes (no separate backend needed)
  - Excellent performance with automatic code splitting
  - Production-ready with minimal configuration

**React 18**
- **Why**: Industry-standard UI library with excellent ecosystem
- **Benefits**:
  - Component-based architecture
  - Hooks for state management
  - Large community and resources
  - Server components support

**TypeScript**
- **Why**: Type safety and better developer experience
- **Benefits**:
  - Catch errors at compile time
  - Better IDE support and autocomplete
  - Self-documenting code
  - Easier refactoring

**Tailwind CSS**
- **Why**: Utility-first CSS framework for rapid UI development
- **Benefits**:
  - No CSS file management
  - Consistent design system
  - Small bundle size (unused styles purged)
  - Responsive design made easy

**Framer Motion**
- **Why**: Production-ready animation library
- **Benefits**:
  - Smooth, performant animations
  - Declarative API
  - Layout animations
  - Gesture support

### State Management

**Zustand**
- **Why**: Lightweight state management with minimal boilerplate
- **Benefits**:
  - Simple API (no providers needed)
  - Built-in persistence
  - TypeScript support
  - Minimal re-renders

**Why not Redux?**
- Redux is overkill for this application's state needs
- Zustand provides similar functionality with 90% less code
- No need for actions, reducers, or middleware

### AI & Backend

**OpenAI API (GPT-4o-mini)**
- **Why**: Best-in-class language model with streaming support
- **Benefits**:
  - Natural language understanding
  - Fast response times (<1s)
  - Cost-effective (mini model)
  - JSON mode for structured outputs
  - Streaming for better UX

**Why not other AI providers?**
- Anthropic Claude: More expensive, similar capabilities
- Google Gemini: Less mature ecosystem
- Open-source models: Require hosting infrastructure

### Data Storage

**File-based JSON**
- **Why**: Simple, fast, and sufficient for read-only food catalog
- **Benefits**:
  - No database setup required
  - Fast read performance (in-memory)
  - Easy to version control
  - Simple deployment

**Why not a database?**
- Food data is static (doesn't change frequently)
- No need for complex queries or relationships
- Reduces infrastructure complexity
- Faster development and deployment

---

## Architecture Patterns

### 1. Server-Side Rendering (SSR)

We use Next.js App Router with a mix of server and client components:

```typescript
// Server Component (default)
// Renders on server, no JavaScript sent to client
export default async function Page() {
  const data = await fetchData(); // Runs on server
  return <View data={data} />;
}

// Client Component
// Runs in browser, interactive
'use client';
export function InteractiveWidget() {
  const [state, setState] = useState();
  return <button onClick={...}>Click me</button>;
}
```

**Benefits**:
- Faster initial page load
- Better SEO
- Reduced client-side JavaScript
- Automatic code splitting

### 2. API Routes Pattern

All backend logic lives in Next.js API routes:

```
app/api/
├── chat/route.ts       # AI chat endpoint
└── order/route.ts      # Order placement
```

**Benefits**:
- No separate backend server needed
- Same codebase for frontend and backend
- Automatic TypeScript type sharing
- Built-in request/response handling

### 3. Component-Based Architecture

Everything is a component, following atomic design principles:

```
components/
├── ui/              # Atomic components (Button, Card, etc.)
├── widgets/         # Molecule components (FoodCard, CartSummary)
├── chat/            # Organism components (ChatInterface)
└── layout/          # Layout components (Header, Footer)
```

### 4. JSON-Based UI Rendering

The backend generates UI as JSON schemas, which the frontend renders dynamically. See [JSON_RENDERING.md](./JSON_RENDERING.md) for details.

---

## Key Design Decisions

### Decision 1: Monolithic vs. Microservices

**Choice**: Monolithic (single Next.js app)

**Rationale**:
- Simpler deployment and development
- No need for service orchestration
- Faster development velocity
- Sufficient for current scale
- Can be split later if needed

**Trade-offs**:
- Harder to scale individual services
- All code in one repository
- Single point of failure

**Conclusion**: For an MVP and interview demo, monolithic is the right choice. Microservices would add unnecessary complexity.

### Decision 2: Client-Side vs. Server-Side Search

**Choice**: Server-side search with client-side caching

**Rationale**:
- Food data is too large to send to client (~2MB)
- Server has more memory and CPU
- Can leverage AI for semantic search
- Easier to update search algorithm

**Implementation**:
```typescript
// Server-side search function
export async function searchFoods(
  query: string,
  filters: SearchFilters,
  limit: number
): Promise<SearchResult[]> {
  // Complex scoring algorithm runs on server
  // Only results sent to client
}
```

### Decision 3: Real-time vs. Polling vs. Streaming

**Choice**: Server-Sent Events (SSE) for AI responses

**Rationale**:
- Better UX than waiting for full response
- Simpler than WebSockets
- Built-in browser support
- No need for additional infrastructure

**Implementation**:
```typescript
// Streaming response
const stream = new ReadableStream({
  async start(controller) {
    for await (const chunk of aiResponse) {
      controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
    }
  }
});
```

### Decision 4: Authentication Strategy

**Choice**: Clerk for authentication (optional feature)

**Rationale**:
- Drop-in solution with minimal code
- Handles security best practices
- Social login support
- User management UI included

**Why not custom auth?**
- Security is hard to get right
- Time-consuming to implement
- Clerk is free for small scale

### Decision 5: State Management Approach

**Choice**: Zustand for global state, React hooks for local state

**Rationale**:
- Cart state needs to persist across pages → Zustand
- Component state (form inputs, UI toggles) → useState
- No need for complex state management

**Example**:
```typescript
// Global cart state (Zustand)
const useCartStore = create(persist(
  (set) => ({
    items: [],
    addItem: (item) => set((state) => ...),
  }),
  { name: 'cart-storage' }
));

// Local component state (React)
const [searchQuery, setSearchQuery] = useState('');
```

---

## Data Flow

### 1. Chat Interaction Flow

```
User types message
       ↓
Client sends to /api/chat
       ↓
Server analyzes intent with OpenAI
       ↓
Server performs search/filtering
       ↓
Server generates JSON UI schema
       ↓
Server streams response (SSE)
       ↓
Client renders components dynamically
       ↓
User interacts with components
       ↓
Actions update cart state (Zustand)
```

### 2. Browse View Flow

```
User opens browse page
       ↓
Server loads all food data
       ↓
Client receives data
       ↓
User applies filters/search
       ↓
Client filters data locally
       ↓
Client renders filtered results
       ↓
User adds to cart
       ↓
Cart state updates (Zustand)
```

### 3. Checkout Flow

```
User clicks checkout
       ↓
Navigate to cart page
       ↓
User fills delivery form
       ↓
Client validates form
       ↓
Client sends order to /api/order
       ↓
Server processes order
       ↓
Server returns confirmation
       ↓
Client shows success message
       ↓
Cart cleared
```

---

## Component Architecture

### Component Hierarchy

```
App Layout
├── Header
│   ├── Logo
│   ├── Navigation
│   └── Cart Icon
├── Main Content
│   ├── Chat View
│   │   ├── Chat Interface
│   │   │   ├── Message List
│   │   │   │   ├── User Message
│   │   │   │   └── AI Message
│   │   │   │       └── Dynamic Component Renderer
│   │   │   └── Message Input
│   │   └── Quick Actions
│   ├── Browse View
│   │   ├── Filter Sidebar
│   │   ├── Search Bar
│   │   └── Food Grid
│   │       └── Food Card
│   └── Cart View
│       ├── Cart Items
│       └── Checkout Form
└── Footer
```

### Component Communication

**Parent → Child**: Props
```typescript
<FoodCard food={foodData} onAddToCart={handleAdd} />
```

**Child → Parent**: Callbacks
```typescript
<Button onClick={() => onAction({ type: 'add_to_cart', ... })} />
```

**Global State**: Zustand
```typescript
const { items, addItem } = useCartStore();
```

**Server → Client**: API calls
```typescript
const response = await fetch('/api/chat', { ... });
```

---

## Performance Optimizations

### 1. Code Splitting

Next.js automatically splits code by route:
- `/` → Chat page bundle
- `/browse` → Browse page bundle
- `/cart` → Cart page bundle

### 2. Image Optimization

Next.js Image component:
- Lazy loading
- Responsive images
- WebP format
- Automatic sizing

### 3. Memoization

React hooks for expensive computations:
```typescript
const filteredFoods = useMemo(
  () => foods.filter(applyFilters),
  [foods, filters]
);
```

### 4. Debouncing

Search input debounced to reduce API calls:
```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, 300);
  return () => clearTimeout(timer);
}, [query]);
```

### 5. Caching

- Food data loaded once and cached in memory
- Cart state persisted to localStorage
- Browser caches static assets

---

## Security Considerations

### API Key Protection

- OpenAI key stored in environment variables
- Never exposed to client
- Server-side API calls only

### Input Validation

- User inputs sanitized before AI processing
- Form validation on client and server
- XSS prevention with React's built-in escaping

### Rate Limiting

- Could add rate limiting to API routes
- OpenAI has built-in rate limits

---

## Scalability Considerations

### Current Scale

- Handles 100+ concurrent users
- 100+ food items
- Instant search results

### Future Scaling Options

1. **Database**: Move to PostgreSQL/MongoDB for dynamic data
2. **Caching**: Add Redis for frequently accessed data
3. **CDN**: Serve static assets from CDN
4. **Load Balancing**: Multiple Next.js instances
5. **Microservices**: Split into separate services if needed

---

## Deployment Architecture

### Development

```
Local Machine
├── Node.js process
├── Hot reload enabled
└── Environment: .env.local
```

### Production (Vercel)

```
Vercel Edge Network
├── CDN (static assets)
├── Serverless Functions (API routes)
├── Edge Runtime (SSR)
└── Environment: Vercel env vars
```

### Docker

```
Docker Container
├── Node.js 18
├── Next.js build
├── Port 3000 exposed
└── Environment: .env
```

---

## Trade-offs & Limitations

### Current Limitations

1. **No real-time order tracking**: Orders are fire-and-forget
2. **No payment integration**: Cash on delivery only
3. **No admin panel**: Food data managed via JSON files
4. **No user profiles**: Limited to session-based cart
5. **Single restaurant**: Not multi-tenant

### Intentional Trade-offs

1. **File-based storage vs. Database**: Simpler, faster development
2. **Monolithic vs. Microservices**: Easier to maintain and deploy
3. **Client-side routing vs. Server-side**: Better UX, some SEO trade-offs
4. **OpenAI vs. Open-source AI**: Better quality, some cost

---

## Future Improvements

### Short-term (1-2 weeks)

- [ ] Add user authentication
- [ ] Order history tracking
- [ ] Favorites/saved items
- [ ] Email notifications

### Medium-term (1-2 months)

- [ ] Admin dashboard
- [ ] Real-time order tracking
- [ ] Payment gateway integration
- [ ] Reviews and ratings

### Long-term (3+ months)

- [ ] Multi-restaurant support
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics
- [ ] Loyalty program
- [ ] Voice ordering

---

## Conclusion

The architecture is designed for:
- **Rapid development**: Minimal setup, fast iteration
- **Great UX**: Fast, responsive, interactive
- **Maintainability**: Clear structure, type safety
- **Scalability**: Can grow with the business

The choices made prioritize developer experience and user experience over premature optimization, while keeping future scaling options open.
