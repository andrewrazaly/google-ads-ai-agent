# MCP (Model Context Protocol) Integration Setup

This application integrates with Google Ads and Google Analytics using MCP servers. This guide explains how the integration works and how to configure it.

## What is MCP?

Model Context Protocol (MCP) is a standardized protocol that allows applications to communicate with external data sources and tools through a unified interface. In this app, we use MCP to connect to Google Ads and Google Analytics APIs.

## Architecture

The application uses the MCP SDK client to communicate with MCP servers that interface with Google services:

```
Google Ads AI Agent (Next.js)
  ↓ (MCP SDK Client)
Google Ads MCP Server → Google Ads API
Google Analytics MCP Server → Google Analytics API
```

## MCP Integration Files

### Core MCP Files Created:

1. **[lib/mcp/client.ts](lib/mcp/client.ts)** - Base MCP client wrapper
2. **[lib/mcp/google-ads.ts](lib/mcp/google-ads.ts)** - Google Ads MCP client
3. **[lib/mcp/google-analytics.ts](lib/mcp/google-analytics.ts)** - Google Analytics MCP client
4. **[lib/mcp/index.ts](lib/mcp/index.ts)** - MCP exports

### API Routes Using MCP:

1. **[app/api/google-ads/campaigns/route.ts](app/api/google-ads/campaigns/route.ts)** - Campaign management
2. **[app/api/analytics/report/route.ts](app/api/analytics/report/route.ts)** - Analytics reports
3. **[app/api/ai/analyze/route.ts](app/api/ai/analyze/route.ts)** - AI analysis combining both data sources

## How MCP Integration Works

### 1. Google Ads MCP Client

The `GoogleAdsMCPClient` class provides methods to:
- Get Google Ads accounts
- Fetch campaigns, ad groups, keywords, and ads
- Retrieve performance metrics
- Create and update campaigns
- Adjust bids
- Pause/enable ad groups

Example usage:
```typescript
import { getGoogleAdsMCPClient } from '@/lib/mcp';

const client = getGoogleAdsMCPClient();
await client.connect();

// Fetch campaigns
const campaigns = await client.getCampaigns('customer-id');

// Get metrics
const metrics = await client.getCampaignMetrics(
  'customer-id',
  'campaign-id',
  '2024-01-01',
  '2024-01-31'
);
```

### 2. Google Analytics MCP Client

The `GoogleAnalyticsMCPClient` class provides methods to:
- Run custom reports
- Get traffic sources
- Fetch conversion data
- Analyze user behavior
- Track campaign performance
- Get real-time user counts

Example usage:
```typescript
import { getGoogleAnalyticsMCPClient } from '@/lib/mcp';

const client = getGoogleAnalyticsMCPClient();
await client.connect();

// Get report
const report = await client.getReport(
  'property-id',
  '2024-01-01',
  '2024-01-31',
  ['source', 'medium'],
  ['sessions', 'conversions']
);
```

## MCP Server Configuration

### Option 1: Using npx (Automatic - Recommended)

The MCP clients are configured to automatically start MCP servers using `npx`:

```typescript
// Google Ads MCP Server
command: "npx",
args: ["-y", "@modelcontextprotocol/server-google-ads"]

// Google Analytics MCP Server
command: "npx",
args: ["-y", "@modelcontextprotocol/server-google-analytics"]
```

This approach automatically downloads and runs the MCP servers when needed.

### Option 2: Manual MCP Server Setup

If you prefer to run MCP servers manually:

1. Install the MCP servers globally:
```bash
npm install -g @modelcontextprotocol/server-google-ads
npm install -g @modelcontextprotocol/server-google-analytics
```

2. Start the servers:
```bash
# Google Ads MCP Server
mcp-server-google-ads

# Google Analytics MCP Server
mcp-server-google-analytics
```

3. Update the MCP client configuration to use server URLs instead of npx.

## Environment Variables

Make sure these environment variables are set in your `.env.local` file:

```env
# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"
GOOGLE_ADS_CLIENT_ID="your-client-id"
GOOGLE_ADS_CLIENT_SECRET="your-client-secret"
GOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"

# Google Analytics
GOOGLE_ANALYTICS_PROPERTY_ID="your-property-id"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

## Available MCP Methods

### Google Ads MCP Methods

- `getAccounts()` - List all Google Ads accounts
- `getCampaigns(customerId)` - Get campaigns for an account
- `getCampaignMetrics(customerId, campaignId, startDate, endDate)` - Get campaign performance
- `getAdGroups(customerId, campaignId)` - Get ad groups in a campaign
- `getKeywords(customerId, adGroupId)` - Get keywords in an ad group
- `createCampaign(customerId, campaignData)` - Create a new campaign
- `updateBid(customerId, adGroupId, newBid)` - Update bid for an ad group
- `pauseAdGroup(customerId, adGroupId)` - Pause an ad group
- `enableAdGroup(customerId, adGroupId)` - Enable an ad group

### Google Analytics MCP Methods

- `getReport(propertyId, startDate, endDate, dimensions, metrics)` - Run custom report
- `getTrafficSources(propertyId, startDate, endDate)` - Get traffic source data
- `getConversions(propertyId, startDate, endDate)` - Get conversion data
- `getUserBehavior(propertyId, startDate, endDate)` - Analyze user behavior
- `getAudienceMetrics(propertyId, startDate, endDate)` - Get audience metrics
- `getCampaignPerformance(propertyId, startDate, endDate, campaignName?)` - Campaign performance
- `getPageViews(propertyId, startDate, endDate, pagePath?)` - Page view statistics
- `getRealtimeUsers(propertyId)` - Current active users

## Testing MCP Integration

### Test the API Routes:

1. **Test Google Ads Campaigns:**
```bash
curl http://localhost:3000/api/google-ads/campaigns?customerId=YOUR_CUSTOMER_ID
```

2. **Test Analytics Report:**
```bash
curl -X POST http://localhost:3000/api/analytics/report \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "YOUR_PROPERTY_ID",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "dimensions": ["source"],
    "metrics": ["sessions"]
  }'
```

3. **Test AI Analysis:**
```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "YOUR_CUSTOMER_ID",
    "propertyId": "YOUR_PROPERTY_ID",
    "timeframe": "last_30_days",
    "goals": ["increase_conversions"]
  }'
```

## Troubleshooting

### MCP Server Not Starting
- Check that npx is installed: `npx --version`
- Ensure network connectivity for downloading MCP packages
- Check environment variables are set correctly

### Authentication Errors
- Verify Google Ads API credentials
- Check refresh token hasn't expired
- Ensure API is enabled in Google Cloud Console

### Connection Timeouts
- MCP servers may take time to start on first run
- Increase timeout values if needed
- Check system resources

## Benefits of MCP Integration

1. **Standardized Interface** - Consistent API across different Google services
2. **Automatic Updates** - MCP servers handle API version changes
3. **Type Safety** - TypeScript interfaces for all data structures
4. **Error Handling** - Built-in error handling and retry logic
5. **Connection Pooling** - Efficient connection management
6. **Caching** - Automatic caching of frequently accessed data

## Next Steps

1. Configure your Google API credentials
2. Test MCP connections using the dashboard
3. Explore available MCP methods for your use case
4. Build custom integrations using the MCP clients

## Resources

- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [Google Analytics API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
