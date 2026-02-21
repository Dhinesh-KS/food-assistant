# 🚀 Getting Started

## Welcome!

Thank you for checking out **Spice & Delight**, an AI-powered food ordering system. This guide will help you get the application running in minutes.

## Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js 18+** installed ([download](https://nodejs.org))
- ✅ **npm** (comes with Node.js)
- ✅ **Git** installed
- ✅ A **Groq API key** (free from [console.groq.com](https://console.groq.com))

Optional:
- Docker Desktop (for Docker deployment)

## Step 1: Get the Code

### Option A: Clone from GitHub
```bash
git clone [YOUR_REPO_URL]
cd food-assistant
```

### Option B: Download ZIP
1. Download the repository as ZIP
2. Extract to a folder
3. Open terminal in that folder

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~500 packages, takes 1-2 minutes).

## Step 3: Get Your Groq API Key

1. Go to https://console.groq.com
2. Sign up (it's free!)
3. Click "API Keys" in the sidebar
4. Click "Create API Key"
5. Copy the key (starts with `gsk_...`)

## Step 4: Configure Environment

```bash
cp .env.example .env.local
```

Open `.env.local` in your editor and add your API key:
```
GROQ_API_KEY=gsk_your_actual_api_key_here
```

**Important**: Never commit `.env.local` to git!

## Step 5: Run the Application

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.35
- Local:        http://localhost:3000

✓ Ready in 2.3s
```

## Step 6: Open in Browser

Navigate to: **http://localhost:3000**

You should see the welcome screen with the Spice & Delight logo!

## Step 7: Test the Features

### Try These Queries:

1. **Click "🥗 Vegetarian Options"**
   - See food cards appear
   - Notice images, prices, nutrition info

2. **Type: "I need high protein meals"**
   - Watch AI respond
   - See filtered results

3. **Add an item to cart**
   - Click "Add to Cart" on any food card
   - See toast notification
   - Notice cart badge updates

4. **Open the cart**
   - Click cart icon (top right)
   - See your items
   - Try changing quantity
   - Try removing an item

5. **Checkout**
   - Click "Proceed to Checkout"
   - Fill the form
   - Submit order
   - See confirmation!

## Alternative: Docker Method

If you prefer Docker:

```bash
# 1. Set up environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 2. Run with Docker
docker-compose up --build

# 3. Open browser
# Go to http://localhost:3000
```

## What to Expect

### First Load
- Welcome screen with quick action buttons
- Clean, modern UI
- Restaurant branding

### After Typing a Query
- AI responds in 1-2 seconds
- Food cards appear with images
- Smooth animations
- Interactive components

### Adding to Cart
- Toast notification
- Cart badge updates
- Item stored (persists on refresh)

### Checkout
- Simple form
- Real-time validation
- Order confirmation
- Estimated delivery time

## Common Issues

### Issue: "Module not found"
**Solution**: 
```bash
rm -rf node_modules
npm install
```

### Issue: "GROQ_API_KEY is not defined"
**Solution**: 
- Check `.env.local` exists
- Verify API key is correct
- Restart dev server

### Issue: "Port 3000 already in use"
**Solution**: 
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Issue: Images not loading
**Solution**: 
- Check `public/images/` folder exists
- Verify resources were copied correctly

## Next Steps

### Explore the Documentation
- **README.md** - Full documentation
- **ARCHITECTURE.md** - Technical details
- **PRODUCT_DECISIONS.md** - Design rationale
- **FEATURES.md** - Complete feature list

### Test Different Scenarios
- Try dietary filters
- Test multi-turn conversations
- Explore different cuisines
- Test cart operations
- Complete a full checkout

### Customize
- Change restaurant name in `app/layout.tsx`
- Adjust colors in `tailwind.config.ts`
- Modify AI prompt in `lib/ai/prompts.ts`
- Add more food items to `resources/Foods.json`

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run with Docker
docker-compose up

# Stop Docker
docker-compose down
```

## File Structure Overview

```
food-assistant/
├── app/                    # Next.js app (pages + API)
├── components/             # React components
├── lib/                    # Business logic
├── resources/              # Food data + images
├── public/                 # Static assets
├── Documentation files     # 10+ guides
└── Configuration files     # Docker, TypeScript, etc.
```

## Support

### Need Help?
- Check **TROUBLESHOOTING** section in README.md
- Review **TESTING_GUIDE.md** for test scenarios
- See **DEPLOYMENT_GUIDE.md** for deployment issues

### Want to Learn More?
- **ARCHITECTURE.md** - How it works
- **PRODUCT_DECISIONS.md** - Why it's built this way
- **FEATURES.md** - What it can do

## Tips for Best Experience

1. **Use Chrome or Firefox** for best compatibility
2. **Enable JavaScript** (required)
3. **Allow localStorage** (for cart persistence)
4. **Good internet connection** (for AI responses)
5. **Try mobile view** (responsive design)

## Success!

If you see:
- ✅ Welcome screen loads
- ✅ AI responds to queries
- ✅ Food cards display
- ✅ Cart works
- ✅ Checkout completes

**You're all set! 🎉**

Enjoy exploring the AI-powered food ordering experience!

---

**Questions?** Check the comprehensive documentation files included in the project.

**Ready to deploy?** Follow **DEPLOYMENT_GUIDE.md** for step-by-step instructions.

**Want to understand the thinking?** Read **PRODUCT_DECISIONS.md** for detailed rationale.
