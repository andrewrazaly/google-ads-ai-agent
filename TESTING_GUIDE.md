# AI Prompt Testing Guide

This guide explains how to test the Google Ads AI prompts with synthetic data using OpenAI's GPT-3.5-turbo.

## 🚀 Quick Start

### 1. Get an OpenAI API Key (Free Tier Available)

1. Go to https://platform.openai.com/signup
2. Sign up for a free account
3. Navigate to https://platform.openai.com/api-keys
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

**Cost**: GPT-3.5-turbo is extremely affordable at ~$0.002 per 1,000 tokens. Testing all 3 prompts will cost less than $0.05.

### 2. Add API Key to Environment

Create or update `.env.local` in the project root:

```bash
# Add this line to .env.local
OPENAI_API_KEY=sk-your-key-here
```

### 3. Start the Development Server

```bash
npm run dev
```

Navigate to http://localhost:3001/dashboard

### 4. Test the Prompts

1. Click on the **"Search Terms"** category tab at the top
2. You'll see 3 prompt cards:
   - **Negative Keyword Identification**
   - **Search Term N-gram Analysis**
   - **Search Term Pattern Analysis**

3. Click **"Use Prompt"** on any card
4. The left sidebar will show:
   - Loading spinner while analyzing
   - AI-generated analysis with recommendations

## 📊 What Gets Tested

Each prompt analyzes **synthetic Google Ads data** that simulates real campaign performance:

### Negative Keyword Identification
- Analyzes 10 search terms with varying performance
- Identifies wasted spend on terms like "national seniors australia insurance" ($23+ spend, 0 conversions)
- Categorizes non-converting terms
- Provides priority-based recommendations

### Search Term N-gram Analysis
- Analyzes 10 n-grams (word patterns) across search queries
- Shows which words/phrases drive conversions
- Identifies problematic patterns (e.g., "contents only" with 0 conversions)
- Recommends optimization opportunities

### Search Term Pattern Analysis
- Analyzes 5 converting search terms
- Identifies common modifiers that drive conversions
- Shows user intent patterns
- Recommends keyword expansion strategies

## 🎯 Expected Results

The AI will provide:

1. **Executive Summary** - Overview of key patterns
2. **Opportunities** - 3-5 specific recommendations
3. **Action Table** - Specific actions with expected impact
4. **Implementation Steps** - How to apply insights
5. **Further Analysis** - Additional analyses to consider

## 🔧 Troubleshooting

### "Demo Mode" Message
If you see a demo response, your OpenAI API key isn't configured:
- Check `.env.local` exists
- Verify key starts with `sk-`
- Restart the dev server after adding the key

### API Key Invalid Error
- Verify you copied the full key
- Check for extra spaces or quotes
- Generate a new key if needed

### No Response
- Check browser console (F12) for errors
- Verify the API endpoint is accessible
- Check network tab for 401/500 errors

## 💡 Demo Mode

If you don't want to use an API key, the system will show a demo response explaining:
- What data would be analyzed
- What the prompt would do
- How to get a real API key

## 📁 Files Involved

- `/lib/synthetic-data.ts` - Synthetic Google Ads data
- `/lib/prompt-library.ts` - Full prompt texts
- `/app/api/ai/test-prompt/route.ts` - API endpoint
- `/app/dashboard/page.tsx` - UI integration

## 🔄 Next Steps

After testing with synthetic data:

1. **Connect Real Data**: Replace synthetic data with actual Google Ads API calls
2. **Add More Prompts**: Expand to Campaigns, PMax, Bidding categories
3. **Customize Responses**: Use the AI Response Customization panel to adjust output style
4. **Export Results**: Add functionality to save/export AI recommendations

## 🎨 UI/UX Features

The testing interface includes:
- ✅ Modern to-do list style task sidebar
- ✅ Category filtering (All Prompts, Search Terms, etc.)
- ✅ Real-time AI response display
- ✅ Loading states with spinners
- ✅ Clear/reset functionality
- ✅ Responsive prompt cards with ratings

## 📝 Cost Estimate

Example costs for testing (GPT-3.5-turbo):
- 1 prompt test: ~$0.01-0.02
- 10 prompt tests: ~$0.10-0.20
- 100 prompt tests: ~$1-2

This makes it extremely affordable for development and testing!
