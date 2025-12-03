# Quick Reference Guide

## 🚀 Server Status
**✅ RUNNING** at http://localhost:3000

## 📍 Quick Links

### Application
- **Landing Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

### Documentation
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current status and overview
- **[GETTING_STARTED.md](GETTING_STARTED.md)** - How to get started
- **[MCP_SETUP.md](MCP_SETUP.md)** - MCP integration details
- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - 32-week development plan
- **[README.md](README.md)** - Project overview

## 🔑 Environment Setup

Edit `.env.local` with your credentials:

```env
# Google Ads
GOOGLE_ADS_DEVELOPER_TOKEN="your-token"
GOOGLE_ADS_CLIENT_ID="your-id"
GOOGLE_ADS_CLIENT_SECRET="your-secret"
GOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"

# Google Analytics
GOOGLE_ANALYTICS_PROPERTY_ID="GA4-XXXXX"

# Anthropic
ANTHROPIC_API_KEY="sk-ant-your-key"
```

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma studio        # Open database GUI

# Other
npm run lint             # Run linter
npm install              # Install dependencies
```

## 📂 Key Files

### Configuration
- `package.json` - Dependencies
- `.env.local` - Environment variables
- `tsconfig.json` - TypeScript config
- `tailwind.config.ts` - Tailwind config

### Application
- `app/page.tsx` - Landing page
- `app/dashboard/page.tsx` - Dashboard
- `app/layout.tsx` - Root layout

### MCP Integration
- `lib/mcp/google-ads.ts` - Google Ads client
- `lib/mcp/google-analytics.ts` - Analytics client
- `lib/mcp/client.ts` - Base MCP client

### API Routes
- `app/api/google-ads/campaigns/route.ts` - Campaigns API
- `app/api/analytics/report/route.ts` - Analytics API
- `app/api/ai/analyze/route.ts` - AI analysis API

### AI & Utilities
- `lib/ai/agent.ts` - AI agent logic
- `lib/utils.ts` - Utility functions
- `lib/prisma.ts` - Database client

### Database
- `prisma/schema.prisma` - Database schema

## 🎯 MCP Quick Reference

### Google Ads MCP Client

```typescript
import { getGoogleAdsMCPClient } from '@/lib/mcp';

const client = getGoogleAdsMCPClient();
await client.connect();

// Get campaigns
const campaigns = await client.getCampaigns(customerId);

// Get metrics
const metrics = await client.getCampaignMetrics(
  customerId, campaignId, startDate, endDate
);

// Update bid
await client.updateBid(customerId, adGroupId, newBidAmount);
```

### Google Analytics MCP Client

```typescript
import { getGoogleAnalyticsMCPClient } from '@/lib/mcp';

const client = getGoogleAnalyticsMCPClient();
await client.connect();

// Get report
const report = await client.getReport(
  propertyId,
  startDate,
  endDate,
  ['source', 'medium'],
  ['sessions', 'conversions']
);

// Get real-time users
const activeUsers = await client.getRealtimeUsers(propertyId);
```

## 🧪 API Testing

```bash
# Get campaigns
curl "http://localhost:3000/api/google-ads/campaigns?customerId=123456"

# Analytics report
curl -X POST http://localhost:3000/api/analytics/report \
  -H "Content-Type: application/json" \
  -d '{"propertyId":"GA4-XXX","startDate":"2024-01-01","endDate":"2024-01-31"}'

# AI analysis
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"customerId":"123456","propertyId":"GA4-XXX"}'
```

## 🐛 Troubleshooting

### Server won't start?
```bash
# Delete .next and restart
rm -rf .next
npm run dev
```

### Dependencies issues?
```bash
# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database issues?
```bash
# Regenerate Prisma client
npx prisma generate
npx prisma db push
```

### Port 3000 in use?
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

## 📊 Project Structure Overview

```
├── app/              # Next.js app (pages, layouts, API routes)
├── components/       # React components
├── lib/              # Libraries (MCP, AI, utilities)
├── prisma/           # Database schema
├── public/           # Static files
└── Documentation/    # All .md files
```

## 🎓 Next Steps

1. **Configure Credentials** - Add to `.env.local`
2. **Update Customer ID** - Edit `app/dashboard/page.tsx`
3. **Test Dashboard** - Click "View Campaigns" and "Run Analysis"
4. **Follow Sprint Plan** - See [PROJECT_PLAN.md](PROJECT_PLAN.md)

## 📞 Need Help?

- Check [GETTING_STARTED.md](GETTING_STARTED.md)
- Review [MCP_SETUP.md](MCP_SETUP.md)
- See [PROJECT_STATUS.md](PROJECT_STATUS.md)
- Read [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

**Current Status**: ✅ All systems running at http://localhost:3000
