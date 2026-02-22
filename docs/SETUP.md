# Setup and Installation Guide

This guide provides detailed instructions for setting up and running the Spice & Delight food ordering application.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

1. **Node.js** (v18.0.0 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for cloning the repository)
   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

### Optional (for Docker deployment)

4. **Docker Desktop** (v20.10.0 or higher)
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - Verify installation: `docker --version`

5. **Docker Compose** (usually comes with Docker Desktop)
   - Verify installation: `docker-compose --version`

### API Keys

You'll need an **OpenAI API key** to run the AI-powered chat features:

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to API keys section
4. Click "Create new secret key"
5. Copy and save your API key securely

> **Note**: The application uses GPT-4o-mini which is cost-effective. For development and testing, the free tier should be sufficient.

---

## Installation Methods

Choose one of the following methods to run the application:

### Method 1: Local Development (Recommended for Development)

This method is best for active development and debugging.

#### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd food-assistant
```

#### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- OpenAI SDK
- Tailwind CSS
- Zustand (state management)
- And other dependencies

#### Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Open `.env.local` in your text editor:

```bash
# On macOS/Linux
nano .env.local

# Or use your preferred editor
code .env.local  # VS Code
```

3. Add your OpenAI API key:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here

# Clerk Authentication (Optional - for user authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Base URL (for production deployment)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

#### Step 4: Run the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000)

You should see output like:

```
▲ Next.js 14.2.0
- Local:        http://localhost:3000
- Ready in 2.3s
```

#### Step 5: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

---

### Method 2: Docker Deployment (Recommended for Testing)

This method provides a containerized environment that's closer to production.

#### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd food-assistant
```

#### Step 2: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and add your OpenAI API key:

```bash
nano .env
```

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

#### Step 3: Build and Run with Docker Compose

```bash
docker-compose up --build
```

This command will:
1. Build the Docker image (first time only, ~2-3 minutes)
2. Install all dependencies inside the container
3. Start the application
4. Map port 3000 from container to your host

You should see output ending with:

```
food-assistant-app | ▲ Next.js 14.2.0
food-assistant-app | - Local:        http://localhost:3000
food-assistant-app | - Ready in 2.3s
```

#### Step 4: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

#### Managing Docker Container

**Stop the container:**
```bash
docker-compose down
```

**Restart the container:**
```bash
docker-compose restart
```

**View logs:**
```bash
docker-compose logs -f
```

**Rebuild after code changes:**
```bash
docker-compose up --build
```

---

## Verification Steps

After starting the application, verify everything is working:

### 1. Check the Homepage

- You should see the chat interface with a welcome message
- The header should display "Spice & Delight"
- Quick action buttons should be visible

### 2. Test the AI Chat

Try these sample queries:

```
"Show me vegetarian options"
"I need high protein meals"
"What desserts do you have?"
```

You should see:
- AI responses streaming in real-time
- Food cards with images appearing
- Add to cart buttons on each card

### 3. Test Cart Functionality

1. Click "Add to Cart" on any food item
2. Check the cart icon in the header (should show item count)
3. Click the cart icon to open the cart drawer
4. Verify items are listed correctly

### 4. Test Browse View

1. Click "Browse Menu" in the navigation
2. Verify the filter sidebar appears
3. Try searching for items
4. Test filters (category, dietary type, etc.)

---

## Common Setup Issues

### Issue: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 already in use"

**Solution:**

Option 1: Kill the process using port 3000
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Option 2: Use a different port
```bash
PORT=3001 npm run dev
```

### Issue: "OpenAI API key not found"

**Solution:**
1. Verify `.env.local` exists in the project root
2. Check that `OPENAI_API_KEY` is set correctly
3. Restart the development server after changing env variables
4. Ensure no extra spaces around the key

### Issue: Docker build fails

**Solution:**
```bash
# Clean Docker cache and rebuild
docker-compose down
docker system prune -a
docker-compose up --build
```

### Issue: Images not loading

**Solution:**
1. Check that `resources/images/` folder exists
2. Verify images are copied to `public/images/`
3. Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Issue: TypeScript errors during build

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## Development Tips

### Hot Reload

The development server supports hot module replacement (HMR). Changes to files will automatically reload in the browser.

### Debugging

1. **Server-side logs**: Check the terminal where you ran `npm run dev`
2. **Client-side logs**: Open browser DevTools (F12) and check the Console tab
3. **Network requests**: Use the Network tab in DevTools to inspect API calls

### Environment Variables

- `.env.local` - Local development (not committed to git)
- `.env.example` - Template with all required variables
- `.env` - Used by Docker (not committed to git)

### Code Structure

```
food-assistant/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utility functions and business logic
├── types/            # TypeScript type definitions
├── resources/        # Food data and images
├── public/           # Static assets
└── docs/             # Documentation
```

---

## Next Steps

After successful setup:

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system design
2. Check [FEATURES.md](./FEATURES.md) to explore all features
3. Review [AI_APPROACH.md](./AI_APPROACH.md) to understand the AI implementation
4. See [JSON_RENDERING.md](./JSON_RENDERING.md) for the dynamic UI system

---

## Getting Help

If you encounter issues not covered here:

1. Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide
2. Review the logs for error messages
3. Ensure all prerequisites are installed correctly
4. Verify your OpenAI API key is valid and has credits
