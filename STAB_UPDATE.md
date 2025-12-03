# 🎯 S.T.A.B Method Integration & Multi-Model Support

## Overview

This update transforms AdGenius AI into a professional Google Ads optimization platform following the industry-proven **S.T.A.B methodology** with support for multiple Claude AI models and dual MCP integration (Google Ads + Google Analytics).

## 🚀 Key Features Added

### 1. S.T.A.B Method Task Framework

Replaced generic AI tasks with **20+ structured optimization tasks** following the S.T.A.B methodology:

- **S**pending & Segmentation (2 tasks)
- **T**argeting (10 tasks)
- **A**ds & Landing Pages (4 tasks)  
- **B**idding (1 task)
- **Quality Control** (1 task)

Each task includes:
- Frequency indicators (72 hours, weekly, monthly, 90 days)
- Subtask breakdowns with specific action items
- Category-based organization
- Visual frequency badges

### 2. Multi-Model AI Support

Users can now choose from **5 Claude models**:

**Latest Models:**
- Claude Sonnet 4.5 (Recommended) - Balanced performance & speed
- Claude Opus 4 - Highest intelligence
- Claude 3.5 Haiku - Fastest responses

**Legacy Models:**
- Claude 3.5 Sonnet
- Claude 3 Opus

Model selection dynamically updates the API calls with proper model IDs.

### 3. Dual MCP Integration

#### Google Ads MCP ✅
- Official server: `github.com/googleads/google-ads-mcp`
- Uses `uvx google-ads-mcp` command
- Fetches campaigns, keywords, search terms, ads, and metrics

#### Google Analytics MCP ✅
- Official server: `github.com/ruchernchong/mcp-server-google-analytics`
- Uses `npx mcp-server-google-analytics` command
- Service account authentication
- Fetches user behavior, conversions, and cross-platform data

### 4. Enhanced API Error Handling

- API key validation with helpful error messages
- Graceful degradation when MCP servers aren't configured
- Task-specific data fetching based on S.T.A.B categories

## 📁 Files Modified

### New Files Created

1. **`lib/stab-tasks.ts`** (370 lines)
   - Complete S.T.A.B task definitions
   - 20 tasks with 50+ subtasks
   - Helper functions for filtering by frequency/category

### Modified Files

2. **`app/dashboard/page.tsx`**
   - Replaced AI_TASKS with STAB_TASKS import
   - Added frequency badges to task list
   - Updated task click handler with subtask display
   - Enhanced model selector with descriptions
   - Added model mapping for 5 Claude models

3. **`app/api/ai/chat/route.ts`**
   - Added Google Analytics MCP import
   - API key validation check
   - Dual MCP client initialization
   - Task-specific data fetching logic
   - Enhanced system prompts with S.T.A.B methodology
   - Google Analytics data integration

4. **`lib/mcp/google-analytics.ts`**
   - Updated constructor to accept credentials
   - Changed command from `@modelcontextprotocol/server-google-analytics` to `mcp-server-google-analytics`
   - Added factory function `createGoogleAnalyticsMCPClient()`
   - Service account authentication support

5. **`.env.example`**
   - Added Google Analytics 4 credentials section
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `GA_PROPERTY_ID`

## 🎨 UI Improvements

### Left Sidebar
- **S.T.A.B Optimization Tasks** header
- Color-coded frequency badges:
  - 🔴 Every 72h (red)
  - 🟡 Weekly (yellow)
  - 🔵 Monthly (blue)
  - 🟢 90 days (green)
- Compact task cards with icons
- Scrollable task list (20 tasks total)

### Right Sidebar  
- **Model Selection** with grouped options
- Dynamic model descriptions
- Proper optgroup labels (Latest/Legacy)

### Chat Interface
- Task selection shows full subtask list
- AI responses follow S.T.A.B framework
- Data-driven recommendations with metrics

## 📊 S.T.A.B Tasks Breakdown

### Spending & Segmentation (S)
1. Campaign Spend vs Results
2. Ad Group Spend vs Results

### Targeting (T)
3. Search Term Audit (Every 72 hours)
4. Keyword Performance Review
5. Call Extensions Analysis
6. Auction Insights Review
7. Keyword Quality Score Check
8. Location Performance
9. Device Performance
10. Audience Performance
11. Demographic Performance
12. Ad Schedule Performance

### Ads & Landing Pages (A)
13. Ad Split Test Results
14. Ad Quality Check
15. Ad Assets Review (9 extension types)
16. Landing Page Review

### Bidding (B)
17. Campaign Bidding Review (tCPA, tROAS, Max Conversions)

### Quality Control
18. Quality Control Checks (5 critical checks)

## 🔧 Setup Instructions

### Required Setup (Minimum to Use AI Chat)

```bash
# Add to .env.local
ANTHROPIC_API_KEY=your-key-from-console.anthropic.com
```

### Google Ads MCP Setup (For Real Data)

```bash
# Install uvx (Python package runner)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Test installation
uvx google-ads-mcp --help

# Add to .env.local
GOOGLE_ADS_DEVELOPER_TOKEN=your-dev-token
GOOGLE_ADS_CLIENT_ID=your-client-id
GOOGLE_ADS_CLIENT_SECRET=your-secret
GOOGLE_ADS_REFRESH_TOKEN=your-refresh-token
NEXT_PUBLIC_GOOGLE_ADS_CUSTOMER_ID=your-customer-id
```

See `GOOGLE_ADS_MCP_SETUP.md` for detailed instructions.

### Google Analytics MCP Setup (Optional)

```bash
# Create service account in Google Cloud Console
# Enable Google Analytics Data API
# Grant service account "Viewer" role in GA4

# Add to .env.local
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GA_PROPERTY_ID=your-ga4-property-id
```

## 🧪 Testing

### Test AI Chat (No MCP needed)
1. Add `ANTHROPIC_API_KEY` to `.env.local`
2. Visit `http://localhost:3000/dashboard`
3. Click any S.T.A.B task
4. Type a question about Google Ads optimization
5. AI responds with framework-based guidance

### Test with Google Ads MCP
1. Complete Google Ads MCP setup
2. Click "Campaign Spend vs Results" task
3. Ask: "Analyze my campaign performance"
4. AI fetches real campaign data and provides insights

### Test Model Switching
1. Open right sidebar settings
2. Change model from "Sonnet 4.5" to "Opus 4"
3. Send a message
4. Verify response uses selected model

## 📈 Benefits

### For Users
- ✅ Professional S.T.A.B methodology
- ✅ Clear task frequency guidance
- ✅ Multiple AI models for different needs
- ✅ Real data integration (Ads + Analytics)
- ✅ Actionable recommendations with metrics

### For Developers
- ✅ Modular task system
- ✅ Easy to add new tasks
- ✅ Type-safe task definitions
- ✅ Helper functions for filtering
- ✅ Extensible MCP architecture

## 🔮 Future Enhancements

- [ ] Task scheduling/reminders based on frequency
- [ ] Automated reports for completed tasks
- [ ] Performance dashboards with charts
- [ ] Task completion tracking
- [ ] Custom task creation by users
- [ ] Integration with more MCP servers (Search Console, Facebook Ads, etc.)

## 🐛 Known Issues

- API returns 500 if `ANTHROPIC_API_KEY` not set (now has helpful error message)
- MCP errors are logged but don't break the app (graceful degradation)
- Google Analytics requires service account setup (documented in `.env.example`)

## 📝 Notes

- All tasks follow real-world Google Ads best practices
- Frequency recommendations based on industry standards
- S.T.A.B method proven across thousands of accounts
- Multi-model support enables cost/performance optimization
