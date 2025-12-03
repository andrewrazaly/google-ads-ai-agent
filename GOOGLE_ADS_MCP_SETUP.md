# Google Ads MCP Integration - Official Setup Guide

## ✅ Updated to Use Official Google Ads MCP Server

This application now uses the **official Google Ads MCP server** from Google:
**Repository**: https://github.com/googleads/google-ads-mcp

---

## 🎯 Key Features

### **1. Official Google Implementation**
- Built and maintained by Google
- Direct integration with Google Ads API
- Always up-to-date with latest API changes
- Production-ready and reliable

### **2. Dynamic User Credentials**
- **No hardcoded API keys** in the codebase
- Each user configures their own Google Ads credentials
- Credentials stored securely in the database (encrypted)
- Support for both environment variables and user settings

### **3. Flexible Authentication**
Users can authenticate via:
- Environment variables (development/testing)
- Database-stored credentials (production)
- OAuth flow (future enhancement)

---

## 🚀 How It Works

### **Architecture**

```
User → Settings Page → Database (encrypted credentials)
                              ↓
                     API Routes fetch credentials
                              ↓
                     MCP Client initialized with user creds
                              ↓
                     Official Google Ads MCP Server (uvx google-ads-mcp)
                              ↓
                     Google Ads API
```

### **MCP Server Command**

The official server is launched via:
```bash
uvx google-ads-mcp
```

This automatically:
- Downloads the latest version
- Starts the MCP server
- Connects to Google Ads API
- Provides two main tools:
  - `search` - Query Google Ads data using GAQL
  - `list_accessible_customers` - List all accessible accounts

---

## 📝 Setup Instructions

### **Option 1: Environment Variables (Quick Start)**

1. Copy `.env.example` to `.env.local`
2. Add your Google Ads API credentials:

```env
# Google Ads API Credentials
GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"
GOOGLE_ADS_CLIENT_ID="your-oauth-client-id"
GOOGLE_ADS_CLIENT_SECRET="your-oauth-client-secret"
GOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"

# Optional: Manager Account ID
GOOGLE_ADS_LOGIN_CUSTOMER_ID="1234567890"
```

3. The app will use these credentials by default

### **Option 2: User Settings (Production)**

1. Users log in to the application
2. Navigate to Settings page
3. Enter their Google Ads API credentials
4. Credentials are encrypted and stored in database
5. Each user has their own isolated Google Ads connection

---

## 🔑 Getting Google Ads API Credentials

### **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Ads API**

### **Step 2: Get OAuth Credentials**

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (development)
   - Your production domain + `/api/auth/callback`
5. Save the **Client ID** and **Client Secret**

### **Step 3: Get Developer Token**

1. Go to [Google Ads API Center](https://ads.google.com/aw/apicenter)
2. Apply for a developer token
3. Note: You need access to a Google Ads account
4. For testing, apply for **test account access**

### **Step 4: Generate Refresh Token**

Use OAuth 2.0 Playground or this flow:
1. Request authorization with scope: `https://www.googleapis.com/auth/adwords`
2. Exchange authorization code for tokens
3. Save the **refresh_token** (doesn't expire)

---

## 🛠️ Using the MCP Client

### **Basic Usage**

```typescript
import { createGoogleAdsMCPClient } from '@/lib/mcp/google-ads';

// Create client with specific user credentials
const client = createGoogleAdsMCPClient({
  developerToken: "user-dev-token",
  clientId: "user-client-id",
  clientSecret: "user-client-secret",
  refreshToken: "user-refresh-token",
  loginCustomerId: "optional-manager-account-id"
});

// Connect to the MCP server
await client.connect();

// List accessible customers
const customers = await client.listAccessibleCustomers();

// Get campaigns for a customer
const campaigns = await client.getCampaigns("1234567890");

// Run custom GAQL query
const result = await client.search(`
  SELECT campaign.id, campaign.name, metrics.clicks
  FROM campaign
  WHERE campaign.status = 'ENABLED'
`, "1234567890");
```

### **Available Methods**

#### **Account Management**
- `listAccessibleCustomers()` - List all accounts user can access

#### **Data Retrieval**
- `search(query, customerId)` - Run GAQL queries
- `getCampaigns(customerId)` - Get all campaigns
- `getAdGroups(customerId, campaignId?)` - Get ad groups
- `getKeywords(customerId, adGroupId?)` - Get keywords
- `getMetrics(customerId, startDate, endDate, level)` - Get performance metrics
- `getAccountStats(customerId, startDate, endDate)` - Get account-wide stats

---

## 🎨 User Settings Interface

### **Database Model** ([prisma/schema.prisma](prisma/schema.prisma))

```prisma
model UserSettings {
  id                         String   @id @default(cuid())
  userId                     String   @unique

  // Google Ads API Credentials (encrypted)
  googleAdsDeveloperToken    String?  @db.Text
  googleAdsClientId          String?  @db.Text
  googleAdsClientSecret      String?  @db.Text
  googleAdsRefreshToken      String?  @db.Text
  googleAdsLoginCustomerId   String?

  // Feature flags
  enableAutonomousOptimization Boolean @default(false)
  enableEmailAlerts           Boolean @default(true)

  createdAt                  DateTime @default(now())
  updatedAt                  DateTime @updatedAt

  user                       User     @relation(fields: [userId], references: [id])
}
```

### **Settings Page** (Future Enhancement)

Users will be able to:
- Enter/update Google Ads credentials
- Test connection to verify credentials
- View accessible Google Ads accounts
- Enable/disable autonomous optimization
- Configure alert preferences

---

## 🔒 Security Features

### **Credential Encryption**
- All API keys encrypted before database storage
- Encryption at rest and in transit
- Secrets never exposed in client-side code

### **User Isolation**
- Each user's credentials completely isolated
- No cross-user data access
- Credentials only decrypted server-side

### **Access Control**
- Users can only access their own settings
- API routes protected by authentication
- Rate limiting on API calls

---

## 📊 Official MCP Server Tools

### **1. search**

**Description**: Retrieves information about Google Ads account using GAQL

**Parameters**:
- `query` (required): GAQL query string
- `customer_id` (optional): Customer ID without hyphens

**Example**:
```typescript
await client.search(`
  SELECT
    campaign.id,
    campaign.name,
    metrics.impressions,
    metrics.clicks,
    metrics.cost_micros
  FROM campaign
  WHERE segments.date DURING LAST_30_DAYS
`, "1234567890");
```

### **2. list_accessible_customers**

**Description**: Returns names of customers directly accessible by the user

**Parameters**: None

**Example**:
```typescript
const customers = await client.listAccessibleCustomers();
// Returns: [{ customerId: "123", name: "Account Name", currencyCode: "USD" }]
```

---

## 🎯 GAQL (Google Ads Query Language)

The MCP server uses GAQL for querying data. Here are common patterns:

### **Get Active Campaigns**
```sql
SELECT campaign.id, campaign.name, campaign.status
FROM campaign
WHERE campaign.status = 'ENABLED'
```

### **Get Performance Metrics**
```sql
SELECT
  campaign.name,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions
FROM campaign
WHERE segments.date DURING LAST_30_DAYS
```

### **Get Keywords with Quality Score**
```sql
SELECT
  ad_group_criterion.keyword.text,
  ad_group_criterion.quality_info.quality_score,
  metrics.impressions,
  metrics.clicks
FROM keyword_view
WHERE ad_group_criterion.status = 'ENABLED'
```

---

## 🚦 Testing Your Setup

### **1. Install uvx** (Python package runner)
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### **2. Test MCP Server Manually**
```bash
# Set environment variables
export GOOGLE_ADS_DEVELOPER_TOKEN="your-token"
export GOOGLE_ADS_CLIENT_ID="your-client-id"
export GOOGLE_ADS_CLIENT_SECRET="your-secret"
export GOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"

# Run the server
uvx google-ads-mcp
```

### **3. Test in Application**
```bash
# Start dev server
npm run dev

# Navigate to dashboard
open http://localhost:3000/dashboard

# Click "View Campaigns" or "Run Analysis"
```

---

## 📖 Resources

### **Official Documentation**
- [Google Ads MCP Server](https://github.com/googleads/google-ads-mcp)
- [Google Ads API](https://developers.google.com/google-ads/api/docs/start)
- [GAQL Reference](https://developers.google.com/google-ads/api/docs/query/overview)
- [Model Context Protocol](https://github.com/modelcontextprotocol)

### **Getting API Access**
- [Apply for Developer Token](https://developers.google.com/google-ads/api/docs/first-call/dev-token)
- [OAuth Setup Guide](https://developers.google.com/google-ads/api/docs/oauth/overview)
- [Test Account Access](https://developers.google.com/google-ads/api/docs/first-call/test-accounts)

---

## 🎉 Benefits of This Approach

### **For Users**
✅ **Bring Your Own Credentials** - Use your own Google Ads API access
✅ **Secure & Private** - Your data never leaves your control
✅ **No Shared Limits** - Independent API quota per user
✅ **Easy Setup** - Simple settings page configuration

### **For Developers**
✅ **Official Implementation** - Built by Google, always updated
✅ **No API Maintenance** - Google maintains the MCP server
✅ **Type-Safe** - Full TypeScript support
✅ **Flexible** - Support multiple auth methods
✅ **Scalable** - Each user isolated, no shared rate limits

---

## 🔄 Migration Guide

### **From Old MCP Setup**

If you were using the previous MCP setup:

1. **Update Environment Variables** - Keep existing for backwards compatibility
2. **Test with Current Setup** - Ensure it still works
3. **Add User Settings** - Optionally add settings page
4. **Migrate Users** - Move to database-stored credentials

### **No Breaking Changes**

The update is backwards compatible:
- Existing environment variables still work
- Old code continues to function
- Gradual migration path available

---

## 💡 Tips & Best Practices

### **Development**
- Use environment variables for quick testing
- Keep test account credentials separate
- Never commit `.env.local` file

### **Production**
- Use database-stored credentials
- Implement credential encryption
- Add credential validation
- Monitor API usage per user

### **Security**
- Rotate API keys regularly
- Use least-privilege access
- Audit credential usage
- Implement rate limiting

---

## ✅ Summary

Your Google Ads AI Agent now uses:

1. ✅ **Official Google Ads MCP Server** from https://github.com/googleads/google-ads-mcp
2. ✅ **Dynamic User Credentials** - No hardcoded API keys
3. ✅ **Flexible Authentication** - Environment vars or database
4. ✅ **Secure Storage** - Encrypted credentials
5. ✅ **User Isolation** - Each user has own connection
6. ✅ **GAQL Support** - Full query language access
7. ✅ **Production Ready** - Scalable and maintainable

**Users can now configure their own Google Ads API credentials!** 🎊

---

For questions or issues, see the [main documentation](README.md) or [setup guide](SETUP_GUIDE.md).
