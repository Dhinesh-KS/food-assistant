# 🚀 Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. ✅ A Groq API key from https://console.groq.com (free)
2. ✅ A GitHub account
3. ✅ A Vercel account (free at https://vercel.com)

## Step-by-Step Deployment

### Step 1: Get Your Groq API Key

1. Go to https://console.groq.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll need it for Vercel)

### Step 2: Push to GitHub

1. Create a new repository on GitHub
2. In your terminal, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI food ordering system"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     - Name: `GROQ_API_KEY`
     - Value: [Paste your Groq API key]
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

6. **Access Your App**
   - Once deployed, you'll get a URL like: `https://your-app.vercel.app`
   - Click "Visit" to open your live application

### Step 4: Test Your Deployment

1. Open the deployed URL
2. Try these test queries:
   - "Show me vegetarian options"
   - "I need high protein meals"
   - "What desserts do you have?"
3. Add items to cart
4. Test checkout flow

## 🐳 Docker Deployment (Alternative)

### Local Docker Testing

1. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

2. **Build and run**
   ```bash
   docker-compose up --build
   ```

3. **Access**
   Open http://localhost:3000

### Production Docker Deployment

For deploying to cloud platforms with Docker support:

1. **Build the image**
   ```bash
   docker build -t food-assistant .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e GROQ_API_KEY=your_key_here \
     food-assistant
   ```

3. **Deploy to cloud**
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

## 🎥 Loom Video Recording Guide

### What to Include in Your Video (3-5 minutes)

#### Part 1: Setup (30 seconds)
- Show the README
- Briefly explain the tech stack
- Show the file structure

#### Part 2: Running Locally (1 minute)
- Show `.env.local` setup (blur the API key!)
- Run `npm install`
- Run `npm run dev`
- Open http://localhost:3000

#### Part 3: User Flows (2 minutes)
Demonstrate these scenarios:

1. **Dietary Preferences**
   - Ask: "Show me vegetarian options"
   - Show the food cards appearing
   - Add an item to cart

2. **Complex Query**
   - Ask: "I need high protein, low carb meals"
   - Show filtered results
   - Demonstrate the AI's response

3. **Multi-turn Conversation**
   - Ask: "I want pizza"
   - Show AI asking clarifying questions
   - Respond and show refined results

4. **Cart & Checkout**
   - Open cart drawer
   - Modify quantities
   - Fill checkout form
   - Show order confirmation

#### Part 4: Technical Highlights (1 minute)
- Show the chat API code
- Explain the search logic
- Show the dynamic component rendering
- Mention Docker support

#### Part 5: Deployment (30 seconds)
- Show the Vercel deployment (if deployed)
- Or explain the deployment process

### Recording Tips

- Use Loom (https://loom.com) - free for up to 5 minutes
- Record in 1080p
- Use a clean browser window (close unnecessary tabs)
- Speak clearly and at a moderate pace
- Show your face (optional but recommended)
- Test your microphone before recording

### Loom Recording Steps

1. Install Loom browser extension or desktop app
2. Click "Start Recording"
3. Choose "Screen + Camera" or "Screen Only"
4. Select the browser window
5. Click "Start Recording"
6. Follow the script above
7. Click "Finish" when done
8. Copy the shareable link

## 🔍 Verification Checklist

Before submitting, verify:

- ✅ Application builds successfully (`npm run build`)
- ✅ Dev server runs without errors (`npm run dev`)
- ✅ Docker builds and runs (`docker-compose up`)
- ✅ All features work:
  - Chat interface loads
  - AI responds to queries
  - Food cards display with images
  - Cart operations work (add/remove/update)
  - Checkout form submits
  - Order confirmation appears
- ✅ Mobile responsive (test on phone or browser dev tools)
- ✅ README is comprehensive
- ✅ .env.example exists
- ✅ Deployed to Vercel and accessible
- ✅ Loom video recorded and link ready

## 📧 Submission

Submit the following:

1. **GitHub Repository URL**
   - Public repository with all source code
   - Comprehensive README
   - Clean commit history

2. **Deployed Application URL**
   - Live Vercel deployment
   - Functional and accessible

3. **Loom Video Link**
   - 3-5 minute walkthrough
   - Demonstrates all key features
   - Explains technical implementation

## 🆘 Common Issues & Solutions

### Issue: Vercel build fails

**Solution**: Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set
- Check for TypeScript errors

### Issue: Images not showing on Vercel

**Solution**: Ensure images are in the repository
- Check `public/images/` folder exists
- Verify images are committed to git
- Check Next.js image configuration

### Issue: API key not working

**Solution**: 
- Verify key is correct in Vercel environment variables
- Redeploy after adding/updating env vars
- Check Groq console for API usage limits

### Issue: Chat not responding

**Solution**:
- Check browser console for errors
- Verify API route is accessible
- Check Groq API status
- Ensure API key has proper permissions

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ Application loads without errors
2. ✅ Chat interface is responsive and functional
3. ✅ AI responds to queries within 2-3 seconds
4. ✅ Food cards display with images
5. ✅ Cart operations work smoothly
6. ✅ Checkout completes successfully
7. ✅ Mobile experience is smooth
8. ✅ No console errors in browser

---

**Good luck with your deployment! 🚀**
