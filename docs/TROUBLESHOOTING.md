# Troubleshooting Guide

This guide helps you resolve common issues when setting up or running the Spice & Delight application.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Runtime Errors](#runtime-errors)
3. [API & Network Issues](#api--network-issues)
4. [Docker Issues](#docker-issues)
5. [Build & Deployment Issues](#build--deployment-issues)
6. [Performance Issues](#performance-issues)

---

## Installation Issues

### Issue: `npm install` fails with permission errors

**Symptoms:**
```
npm ERR! code EACCES
npm ERR! syscall access
npm ERR! path /usr/local/lib/node_modules
```

**Solution:**

Option 1: Use nvm (recommended)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js
nvm install 18
nvm use 18

# Retry installation
npm install
```

Option 2: Fix permissions
```bash
sudo chown -R $USER /usr/local/lib/node_modules
npm install
```

---

### Issue: `npm install` fails with network timeout

**Symptoms:**
```
npm ERR! network timeout
npm ERR! network This is a problem related to network connectivity
```

**Solution:**

```bash
# Increase timeout
npm install --timeout=60000

# Or use a different registry
npm install --registry=https://registry.npmjs.org/

# Or clear cache and retry
npm cache clean --force
npm install
```

---

### Issue: Module not found after installation

**Symptoms:**
```
Error: Cannot find module 'next'
```

**Solution:**

```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

---

## Runtime Errors

### Issue: "OpenAI API key not found"

**Symptoms:**
```
Error: OpenAI API key not configured
```

**Solution:**

1. Check that `.env.local` exists in project root:
```bash
ls -la .env.local
```

2. Verify the file contains your API key:
```bash
cat .env.local
```

Should show:
```
OPENAI_API_KEY=sk-...
```

3. Ensure no extra spaces:
```bash
# Correct
OPENAI_API_KEY=sk-abc123

# Incorrect (space before key)
OPENAI_API_KEY= sk-abc123
```

4. Restart the development server:
```bash
# Stop with Ctrl+C
npm run dev
```

---

### Issue: "Port 3000 already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

Option 1: Kill the process using port 3000
```bash
# On macOS/Linux
lsof -ti:3000 | xargs kill -9

# On Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

Option 2: Use a different port
```bash
PORT=3001 npm run dev
```

---

### Issue: Images not loading

**Symptoms:**
- Broken image icons
- 404 errors in browser console
- `Failed to load resource: the server responded with a status of 404`

**Solution:**

1. Check that images exist:
```bash
ls -la public/images/
```

2. Verify image paths in Foods.json:
```bash
grep -o '"image": "[^"]*"' resources/Foods.json | head -5
```

Should show paths like:
```
"image": "images/butter-chicken.jpg"
```

3. Check Next.js image configuration:
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  }
};
```

4. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

---

### Issue: Chat not responding

**Symptoms:**
- User types message but nothing happens
- No AI response
- Loading spinner forever

**Solution:**

1. Check browser console for errors:
```
Right-click → Inspect → Console tab
```

2. Verify API key is valid:
```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

Should return a list of models. If not, your key is invalid.

3. Check API route logs:
```bash
# Terminal where you ran npm run dev
# Look for errors like:
# Error: OpenAI API error: 401 Unauthorized
```

4. Verify network requests:
```
Browser DevTools → Network tab → Filter: Fetch/XHR
Look for failed requests to /api/chat
```

5. Check OpenAI account:
- Go to https://platform.openai.com/account/usage
- Verify you have credits/quota remaining

---

### Issue: Cart not persisting

**Symptoms:**
- Items added to cart disappear on page refresh
- Cart resets unexpectedly

**Solution:**

1. Check browser localStorage:
```javascript
// In browser console
localStorage.getItem('cart-storage')
```

Should show cart data. If null, localStorage is disabled.

2. Enable localStorage:
- Check browser privacy settings
- Disable "Block third-party cookies"
- Try incognito/private mode

3. Clear corrupted data:
```javascript
// In browser console
localStorage.removeItem('cart-storage')
// Refresh page
```

---

### Issue: TypeScript errors

**Symptoms:**
```
Type 'Food' is not assignable to type 'FoodItem'
```

**Solution:**

1. Restart TypeScript server:
```
In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

2. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

3. Check TypeScript version:
```bash
npx tsc --version
```

Should be 5.0+. If not:
```bash
npm install typescript@latest
```

---

## API & Network Issues

### Issue: OpenAI API rate limit

**Symptoms:**
```
Error: Rate limit exceeded
Status: 429
```

**Solution:**

1. Check your rate limits:
- Go to https://platform.openai.com/account/rate-limits
- Free tier: 3 requests/minute, 200 requests/day

2. Implement retry with backoff:
```typescript
// Already implemented in the code
async function retryWithBackoff(fn: Function, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        await sleep(1000 * Math.pow(2, i));
        continue;
      }
      throw error;
    }
  }
}
```

3. Upgrade to paid tier:
- Go to https://platform.openai.com/account/billing
- Add payment method
- Rate limits increase significantly

---

### Issue: Slow API responses

**Symptoms:**
- Chat takes >5 seconds to respond
- Loading spinner for a long time

**Solution:**

1. Check your internet connection:
```bash
ping api.openai.com
```

2. Verify streaming is enabled:
```typescript
// In app/api/chat/route.ts
const completion = await openai.chat.completions.create({
  // ...
  stream: true  // Should be true
});
```

3. Reduce max_tokens:
```typescript
const completion = await openai.chat.completions.create({
  // ...
  max_tokens: 512  // Lower = faster
});
```

4. Check OpenAI status:
- Go to https://status.openai.com/
- Look for outages or degraded performance

---

### Issue: CORS errors

**Symptoms:**
```
Access to fetch at 'http://localhost:3000/api/chat' from origin 'http://localhost:3001' has been blocked by CORS policy
```

**Solution:**

This shouldn't happen with Next.js, but if it does:

1. Check that you're accessing the app at the correct URL:
```
http://localhost:3000  ✅ Correct
http://127.0.0.1:3000  ❌ Different origin
```

2. Add CORS headers if needed:
```typescript
// app/api/chat/route.ts
export async function POST(req: Request) {
  const response = await handleChat(req);
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  return response;
}
```

---

## Docker Issues

### Issue: Docker build fails

**Symptoms:**
```
ERROR [internal] load metadata for docker.io/library/node:18-alpine
```

**Solution:**

1. Check Docker is running:
```bash
docker ps
```

If error, start Docker Desktop.

2. Pull base image manually:
```bash
docker pull node:18-alpine
```

3. Clear Docker cache:
```bash
docker system prune -a
docker-compose build --no-cache
```

---

### Issue: Docker container exits immediately

**Symptoms:**
```
food-assistant-app exited with code 1
```

**Solution:**

1. Check container logs:
```bash
docker-compose logs app
```

2. Common issues:
- Missing environment variables
- Port already in use
- Build errors

3. Run container interactively:
```bash
docker-compose run app sh
# Inside container:
npm run dev
```

---

### Issue: Docker can't access environment variables

**Symptoms:**
```
Error: OPENAI_API_KEY is not defined
```

**Solution:**

1. Check `.env` file exists:
```bash
ls -la .env
```

2. Verify docker-compose.yml:
```yaml
services:
  app:
    env_file:
      - .env  # Should be present
```

3. Rebuild container:
```bash
docker-compose down
docker-compose up --build
```

---

## Build & Deployment Issues

### Issue: Build fails with "Out of memory"

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**

1. Increase Node.js memory:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

2. Or add to package.json:
```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

---

### Issue: Vercel deployment fails

**Symptoms:**
```
Error: Build failed
```

**Solution:**

1. Check build logs in Vercel dashboard

2. Common issues:
- Missing environment variables
- TypeScript errors
- Build timeout

3. Add environment variables in Vercel:
- Go to Project Settings → Environment Variables
- Add `OPENAI_API_KEY`

4. Increase build timeout:
- Go to Project Settings → General
- Upgrade plan if needed

---

### Issue: Images not showing in production

**Symptoms:**
- Images work locally but not in production
- 404 errors for images

**Solution:**

1. Check image paths:
```typescript
// Correct (relative to public/)
<Image src="/images/food.jpg" />

// Incorrect
<Image src="images/food.jpg" />
```

2. Verify images are in public folder:
```bash
ls -la public/images/
```

3. Check Next.js config:
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
  }
};
```

---

## Performance Issues

### Issue: Slow page load

**Symptoms:**
- Pages take >3 seconds to load
- Laggy interactions

**Solution:**

1. Check bundle size:
```bash
npm run build
# Look for large chunks
```

2. Analyze bundle:
```bash
npm install -D @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... config
});
```

```bash
ANALYZE=true npm run build
```

3. Optimize images:
- Use WebP format
- Reduce image sizes
- Enable lazy loading

4. Enable caching:
```typescript
// app/api/chat/route.ts
export const revalidate = 60; // Cache for 60 seconds
```

---

### Issue: High memory usage

**Symptoms:**
- Browser tab uses >500MB RAM
- System becomes slow

**Solution:**

1. Check for memory leaks:
```javascript
// In browser console
performance.memory
```

2. Clear browser cache:
```
Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)
```

3. Reduce conversation history:
```typescript
// Keep only last 4 messages
const recentMessages = messages.slice(-4);
```

4. Implement pagination:
```typescript
// Load items in batches
const [displayCount, setDisplayCount] = useState(12);
```

---

## Getting More Help

If your issue isn't covered here:

1. **Check the logs**:
   - Browser console (F12)
   - Terminal output
   - Docker logs (`docker-compose logs`)

2. **Search for the error**:
   - Copy exact error message
   - Search on Google, Stack Overflow
   - Check Next.js/OpenAI documentation

3. **Verify setup**:
   - Node.js version: `node --version` (should be 18+)
   - npm version: `npm --version`
   - Environment variables: `cat .env.local`

4. **Clean install**:
   ```bash
   rm -rf node_modules .next package-lock.json
   npm install
   npm run dev
   ```

5. **Check system requirements**:
   - macOS 10.15+, Windows 10+, or Linux
   - 4GB+ RAM
   - 1GB+ free disk space
   - Stable internet connection

---

## Common Error Messages

### "Cannot read property 'map' of undefined"

**Cause**: Data not loaded yet

**Solution**: Add loading check
```typescript
{foods?.map(food => <FoodCard key={food.id} food={food} />)}
```

---

### "Hydration failed"

**Cause**: Server and client HTML mismatch

**Solution**: Use client component
```typescript
'use client';
export function Component() { ... }
```

---

### "Maximum update depth exceeded"

**Cause**: Infinite re-render loop

**Solution**: Check useEffect dependencies
```typescript
useEffect(() => {
  // ...
}, [dependency]); // Add dependencies
```

---

### "Failed to fetch"

**Cause**: Network error or API route issue

**Solution**:
1. Check API route exists
2. Verify request method (GET/POST)
3. Check network tab in DevTools

---

## Prevention Tips

1. **Always use version control**:
   ```bash
   git init
   git add .
   git commit -m "Working version"
   ```

2. **Test before deploying**:
   ```bash
   npm run build
   npm run start
   ```

3. **Keep dependencies updated**:
   ```bash
   npm outdated
   npm update
   ```

4. **Monitor API usage**:
   - Check OpenAI dashboard regularly
   - Set up billing alerts

5. **Use environment variables**:
   - Never commit API keys
   - Use `.env.local` for local development
   - Use platform secrets for production

---

## Still Having Issues?

If you're still stuck:

1. Create a minimal reproduction
2. Check if it works in a fresh install
3. Review the documentation again
4. Check for typos in configuration files
5. Try the Docker setup if local setup fails (or vice versa)

Most issues are caused by:
- Missing/incorrect environment variables (40%)
- Port conflicts (20%)
- Outdated dependencies (15%)
- Network/API issues (15%)
- Configuration errors (10%)

Double-check these areas first!
