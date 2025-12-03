# 🔄 OAuth Migration - User-Specific Credentials

## What Changed

Your app now uses **per-user OAuth tokens** instead of shared environment variable credentials. This means each user authenticates with their own Google account and the app automatically uses their credentials to access their Google Ads and Analytics data.

## Key Improvements

### Before (Environment Variables)
```bash
# ❌ Old approach - Everyone used the same credentials
GOOGLE_ADS_CLIENT_ID="shared-credentials"
GOOGLE_ADS_CLIENT_SECRET="shared-credentials"
GOOGLE_ADS_REFRESH_TOKEN="admin-refresh-token"
```

**Problems:**
- All users saw the same Google Ads account
- Had to manually generate refresh tokens for each user
- No data isolation between users
- Security risk - shared credentials

### After (Per-User OAuth)
```bash
# ✅ New approach - Users authenticate themselves
GOOGLE_CLIENT_ID="your-oauth-credentials"
GOOGLE_CLIENT_SECRET="your-oauth-credentials"
# Each user gets their own tokens when they sign in!
```

**Benefits:**
- ✅ Each user sees only their own data
- ✅ No manual token generation
- ✅ Automatic token refresh
- ✅ Proper SaaS multi-tenant architecture
- ✅ Better security - tokens isolated per session

## Technical Changes

### 1. OAuth Scopes Added

Added Google Analytics read scope to the existing Google Ads scope:

```typescript
// auth.config.ts
scope: [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/adwords",              // Google Ads
  "https://www.googleapis.com/auth/analytics.readonly",   // Analytics ✨ NEW
].join(" ")
```

### 2. API Routes Updated

All API routes now check for user session and use session tokens:

#### `/api/google-ads/campaigns/route.ts`
```typescript
// ✅ NEW: Get user session
const session = await auth();

if (!session?.accessToken) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// ✅ NEW: Use user's refresh token
const mcpClient = createGoogleAdsMCPClient({
  developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: session.refreshToken, // ✨ User-specific token
});
```

#### `/api/ai/chat/route.ts`
```typescript
// ✅ NEW: Session authentication
const session = await auth();

if (!session?.accessToken) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// ✅ NEW: Google Ads with user tokens
const googleAdsClient = createGoogleAdsMCPClient({
  developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: session.refreshToken, // ✨ User-specific token
});

// ✅ NEW: Google Analytics with user tokens
const googleAnalyticsClient = createGoogleAnalyticsMCPClient({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: session.refreshToken, // ✨ User-specific token
  propertyId: gaPropertyId,
});
```

#### `/api/analytics/report/route.ts`
```typescript
// ✅ NEW: Session authentication
const session = await auth();

if (!session?.accessToken) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// ✅ NEW: Use user's OAuth tokens instead of Service Account
const mcpClient = createGoogleAnalyticsMCPClient({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: session.refreshToken, // ✨ User-specific token
  propertyId: propertyId,
});
```

### 3. MCP Client Updates

#### Google Ads MCP Client
No changes needed - already supported OAuth credentials.

#### Google Analytics MCP Client
```typescript
// ✅ NEW: Support both Service Account AND OAuth
export interface GoogleAnalyticsCredentials {
  // Service Account credentials (for shared/admin access)
  clientEmail?: string;
  privateKey?: string;
  propertyId?: string;
  // OAuth credentials (for per-user access) ✨ NEW
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

constructor(credentials?: GoogleAnalyticsCredentials) {
  const env: Record<string, string> = { ...process.env };

  // ✅ NEW: If OAuth credentials provided, use them
  if (credentials?.refreshToken && credentials?.clientId && credentials?.clientSecret) {
    env.GOOGLE_CLIENT_ID = credentials.clientId;
    env.GOOGLE_CLIENT_SECRET = credentials.clientSecret;
    env.GOOGLE_REFRESH_TOKEN = credentials.refreshToken;
  }
  // Otherwise fall back to Service Account
  else {
    env.GOOGLE_CLIENT_EMAIL = credentials?.clientEmail || process.env.GOOGLE_CLIENT_EMAIL || "";
    env.GOOGLE_PRIVATE_KEY = credentials?.privateKey || process.env.GOOGLE_PRIVATE_KEY || "";
  }
}
```

### 4. Type Definitions

Created `types/next-auth.d.ts` to extend NextAuth session:

```typescript
declare module "next-auth" {
  interface Session {
    accessToken?: string;    // ✨ Google OAuth access token
    refreshToken?: string;   // ✨ Google OAuth refresh token
    error?: string;
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}
```

## Environment Variables

### Required (Minimal Setup)

```bash
# Google OAuth (handles auth + API access)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Google Ads Developer Token
GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"

# Anthropic API
ANTHROPIC_API_KEY="your-anthropic-key"
```

### Removed (No Longer Needed)

```bash
# ❌ GOOGLE_ADS_CLIENT_ID          → Use GOOGLE_CLIENT_ID
# ❌ GOOGLE_ADS_CLIENT_SECRET      → Use GOOGLE_CLIENT_SECRET
# ❌ GOOGLE_ADS_REFRESH_TOKEN      → Users provide via OAuth
# ❌ GOOGLE_CLIENT_EMAIL           → Not needed for OAuth
# ❌ GOOGLE_PRIVATE_KEY            → Not needed for OAuth
# ❌ GA_PROPERTY_ID                → Users select their own
```

## User Flow

1. **User visits landing page**
   - Sees "Sign in with Google" button

2. **User clicks sign in**
   - Redirected to Google OAuth consent screen
   - Asked to grant permissions:
     - ✅ View email and profile
     - ✅ Manage Google Ads accounts
     - ✅ Read Google Analytics data

3. **User approves**
   - Redirected back to dashboard
   - Session created with:
     - `accessToken` (for immediate API calls)
     - `refreshToken` (for getting new access tokens)

4. **API calls use user's tokens**
   - All API routes get tokens from session
   - MCP clients use user-specific credentials
   - User sees only their own data

5. **Tokens auto-refresh**
   - When `accessToken` expires (after 1 hour)
   - System automatically uses `refreshToken` to get new `accessToken`
   - Seamless - user never notices

## Data Isolation

### Before
```
User A → Signs in → Sees Admin's Google Ads Account (123456789)
User B → Signs in → Sees Admin's Google Ads Account (123456789)
```

### After
```
User A → Signs in → Sees Their Account (111111111)
User B → Signs in → Sees Their Account (222222222)
```

Each user's session contains their own tokens, ensuring complete data isolation.

## Migration Checklist

- [x] Add Analytics scope to OAuth configuration
- [x] Update Google Ads API routes to use session tokens
- [x] Update Analytics API routes to use session tokens
- [x] Update AI chat route to use session tokens
- [x] Extend GoogleAnalyticsCredentials interface for OAuth
- [x] Update Google Analytics MCP client to support OAuth
- [x] Create NextAuth type definitions
- [x] Update `.env.example` documentation
- [x] Update `GOOGLE_AUTH_COMPLETE.md` guide

## Testing

1. **Sign in with Google**
   ```
   npm run dev
   open http://localhost:3000
   Click "Sign in with Google"
   ```

2. **Verify session**
   ```typescript
   // In dashboard or API route
   const session = await auth();
   console.log(session.accessToken);  // Should exist
   console.log(session.refreshToken); // Should exist
   ```

3. **Test API calls**
   ```bash
   # Should return user's campaigns (not shared admin account)
   curl http://localhost:3000/api/google-ads/campaigns?customerId=YOUR_CUSTOMER_ID
   ```

## Rollback Plan

If you need to revert to the old approach:

1. Restore environment variables:
   ```bash
   GOOGLE_ADS_CLIENT_ID="old-credentials"
   GOOGLE_ADS_CLIENT_SECRET="old-credentials"
   GOOGLE_ADS_REFRESH_TOKEN="old-token"
   ```

2. Update API routes to use `process.env` instead of `session.refreshToken`

3. Remove session authentication checks

However, this is **NOT recommended** as it breaks the multi-tenant architecture.

## Benefits Summary

| Feature | Before | After |
|---------|--------|-------|
| **Setup Complexity** | Manual refresh tokens | One-click OAuth |
| **Data Isolation** | ❌ Shared account | ✅ Per-user |
| **Token Management** | ❌ Manual | ✅ Automatic |
| **Security** | ❌ Shared credentials | ✅ Per-session tokens |
| **Scalability** | ❌ Single account | ✅ Multi-tenant |
| **User Experience** | ❌ Admin-only | ✅ Self-service |

## Next Steps

1. **Enable Google Ads API** in Google Cloud Console
2. **Enable Google Analytics Data API** in Google Cloud Console
3. **Test OAuth flow** with real Google account
4. **Add account selector** for users with multiple accounts
5. **Add sign-out button** in dashboard
6. **Show user profile** in navigation

Your app is now a proper multi-tenant SaaS application! 🎉
