# 🧪 Testing Guide

## Test Scenarios

### Scenario 1: Simple Discovery
**Goal**: Test basic search functionality

**Steps:**
1. Open the app
2. Type: "Show me vegetarian options"
3. Observe: AI responds + food cards appear
4. Click on a food card to expand description
5. Add one item to cart
6. Verify: Toast notification appears

**Expected Results:**
- 6 vegetarian food items displayed
- Each card shows image, price, nutrition
- Add to cart works smoothly
- Cart badge updates

### Scenario 2: Dietary Requirements
**Goal**: Test nutritional filtering

**Steps:**
1. Type: "I need high protein meals"
2. Observe: Results filtered automatically
3. Check nutrition info on cards
4. Type: "Show me low carb options"
5. Observe: Different results

**Expected Results:**
- High protein items (>20g protein)
- Low carb items (<20g carbs)
- Nutrition facts visible on cards
- Relevant AI responses

### Scenario 3: Multi-turn Conversation
**Goal**: Test conversational intelligence

**Steps:**
1. Type: "I want pizza"
2. Observe: AI asks clarifying questions
3. Respond: "Something with chicken"
4. Observe: Refined results
5. Type: "Add the BBQ chicken pizza"
6. Observe: AI confirms addition

**Expected Results:**
- AI asks follow-up questions
- Results refine based on responses
- Context maintained across messages
- Natural conversation flow

### Scenario 4: Complex Query
**Goal**: Test multiple filters at once

**Steps:**
1. Type: "High protein vegetarian under 400 calories"
2. Observe: Multiple filters applied
3. Check results meet all criteria
4. Add item to cart

**Expected Results:**
- All results are vegetarian
- All have >20g protein
- All under 400 calories
- Relevant items shown

### Scenario 5: Cart Management
**Goal**: Test cart operations

**Steps:**
1. Add 3 different items to cart
2. Click cart icon (top right)
3. Increase quantity of one item
4. Decrease quantity of another
5. Remove one item
6. Observe: Total updates in real-time

**Expected Results:**
- Cart drawer opens smoothly
- Quantity changes work
- Remove works
- Total recalculates correctly
- Tax and delivery fee shown

### Scenario 6: Checkout Flow
**Goal**: Test order placement

**Steps:**
1. Have items in cart
2. Open cart drawer
3. Click "Proceed to Checkout"
4. Fill form:
   - Name: John Doe
   - Phone: +91 98765 43210
   - Address: 123 Main St, Mumbai
   - Notes: Extra spicy
5. Submit order
6. Observe: Confirmation appears

**Expected Results:**
- Form validation works
- Order submits successfully
- Confirmation shows with order ID
- Cart clears
- Estimated delivery time shown

### Scenario 7: Mobile Experience
**Goal**: Test mobile responsiveness

**Steps:**
1. Open browser dev tools
2. Switch to mobile view (iPhone/Android)
3. Test all features:
   - Chat interface
   - Food cards (1 column)
   - Cart drawer
   - Checkout form
4. Test touch interactions

**Expected Results:**
- Layout adjusts to mobile
- Buttons are touch-friendly
- Text is readable
- No horizontal scroll
- Smooth animations

### Scenario 8: Edge Cases
**Goal**: Test error handling

**Steps:**
1. Type gibberish: "asdfghjkl"
2. Observe: AI handles gracefully
3. Try empty search
4. Try very long query
5. Remove GROQ_API_KEY and test
6. Test with slow network

**Expected Results:**
- Graceful error messages
- No crashes
- Helpful suggestions
- Retry options
- Loading states

### Scenario 9: Cuisine Exploration
**Goal**: Test category browsing

**Steps:**
1. Type: "What North Indian dishes do you have?"
2. Observe: North Indian items shown
3. Type: "Show me South Indian food"
4. Observe: Different cuisine shown
5. Type: "Any desserts?"
6. Observe: Dessert items shown

**Expected Results:**
- Correct category filtering
- Diverse items shown
- AI provides context
- Easy to switch categories

### Scenario 10: Meal Planning
**Goal**: Test multi-item ordering

**Steps:**
1. Type: "I need lunch for two people"
2. Observe: AI asks preferences
3. Respond: "One vegetarian, one chicken"
4. Observe: Suggestions for both
5. Add items from both categories
6. Type: "Add drinks and dessert"
7. Observe: Beverage and dessert options

**Expected Results:**
- AI understands multi-person order
- Suggests appropriate quantities
- Recommends complete meal
- Easy to build full order

## Performance Testing

### Load Time
- **Target**: < 3 seconds initial load
- **Test**: Open app with throttled network
- **Measure**: Chrome DevTools Performance tab

### AI Response Time
- **Target**: < 2 seconds per response
- **Test**: Send multiple queries
- **Measure**: Time from send to response

### Search Performance
- **Target**: < 50ms search execution
- **Test**: Console.time() around search
- **Measure**: Browser console

### Image Loading
- **Target**: Progressive loading, no layout shift
- **Test**: Slow 3G network simulation
- **Measure**: Visual inspection

## Accessibility Testing

### Keyboard Navigation
- Tab through all interactive elements
- Enter to submit forms
- Escape to close drawers

### Screen Reader
- Test with VoiceOver (Mac) or NVDA (Windows)
- Verify alt text on images
- Check ARIA labels

### Color Contrast
- Verify text is readable
- Check against WCAG AA standards
- Test in dark mode (if implemented)

## Browser Compatibility

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## Automated Testing (Future)

### Unit Tests
```bash
npm test
```

Test coverage:
- Search algorithm
- Filter logic
- Cart operations
- Utility functions

### Integration Tests
```bash
npm run test:integration
```

Test coverage:
- API endpoints
- Database operations
- External API calls

### E2E Tests
```bash
npm run test:e2e
```

Test coverage:
- Complete user flows
- Multi-page interactions
- Form submissions

## Bug Reporting Template

If you find issues, report with:

```
**Bug Description**: [What went wrong]
**Steps to Reproduce**: [How to trigger the bug]
**Expected Behavior**: [What should happen]
**Actual Behavior**: [What actually happened]
**Environment**: [Browser, OS, device]
**Screenshots**: [If applicable]
```

## Test Checklist

Before submitting, verify:

- ✅ All 10 scenarios pass
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Images load correctly
- ✅ Cart persists on refresh
- ✅ Checkout completes
- ✅ AI responds appropriately
- ✅ Performance targets met
- ✅ Cross-browser compatible
- ✅ Docker build works

## Known Limitations (MVP)

1. **No Authentication**: Cart doesn't sync across devices
2. **In-Memory Orders**: Orders lost on server restart
3. **Basic AI**: No advanced reasoning or memory
4. **Limited Error Recovery**: Some edge cases not handled
5. **No Analytics**: No usage tracking

These are acceptable for MVP and can be addressed in future iterations.

---

**Testing ensures quality! 🧪**
