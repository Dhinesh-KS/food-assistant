# ⚡ Quick Start Guide

Get the app running in under 5 minutes!

## 🚀 Fastest Way (Docker)

```bash
# 1. Get a free Groq API key
# Visit: https://console.groq.com
# Sign up and create an API key

# 2. Set up environment
cp .env.example .env
# Edit .env and paste your GROQ_API_KEY

# 3. Run with Docker
docker-compose up --build

# 4. Open browser
# Go to: http://localhost:3000
```

Done! 🎉

## 🛠️ Alternative (npm)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# 3. Run dev server
npm run dev

# 4. Open browser
# Go to: http://localhost:3000
```

## 🧪 Test Queries

Try these to see the AI in action:

1. "Show me vegetarian options"
2. "I need high protein meals"
3. "What desserts do you have?"
4. "Something spicy with chicken"
5. "I want pizza"

## 🎯 What to Expect

- **AI responds** in 1-2 seconds
- **Food cards appear** with images and details
- **Add to cart** with one click
- **Cart drawer** slides in from right
- **Checkout** completes in seconds

## ❓ Issues?

**Chat not responding?**
- Check your GROQ_API_KEY is set correctly
- Verify you have internet connection
- Check browser console for errors

**Images not loading?**
- Images should be in `public/images/`
- Check the resources folder was copied

**Build fails?**
- Run: `npm install`
- Delete `.next` folder and rebuild

## 📚 More Info

- Full documentation: [README.md](README.md)
- Architecture details: [ARCHITECTURE.md](ARCHITECTURE.md)
- Product decisions: [PRODUCT_DECISIONS.md](PRODUCT_DECISIONS.md)
- Deployment guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

**Happy ordering! 🍽️**
