# ✅ Google Sign-In with Google Ads & Analytics API Access - Complete!

## What Was Implemented

You now have **Google OAuth authentication that automatically grants access to users' Google Ads AND Google Analytics accounts**. When users sign in, they give your app permission to access their data, and you store their access tokens for API calls.

## How It Works

### User Flow

1. **User clicks "Sign in with Google"**
   - Sees Google consent screen
   - **Asked to grant permission to:**
     - Manage Google Ads
     - Read Google Analytics data
   - Grants permission

2. **Your app receives:**
   - ✅ User profile (name, email, photo)
   - ✅ Google Ads API `access_token`
   - ✅ Google Analytics API `access_token`
   - ✅ `refresh_token` for both APIs
   - ✅ Token expiration time

3. **Tokens stored in session**
   - Access token for immediate API calls
   - Refresh token to get new access tokens
   - Automatic token refresh when expired

4. **Use tokens to access Google Ads & Analytics**
   - No need for users to manually configure API credentials
   - Your MCP clients use their tokens automatically
   - Each user sees only their own data

## OAuth Scopes Requested

```javascript
scope: [
  "openid",                                                  // User ID
  "email",                                                   // Email address
  "profile",                                                 // Name & photo
  "https://www.googleapis.com/auth/adwords",                // Google Ads API access ✨
  "https://www.googleapis.com/auth/analytics.readonly",     // Google Analytics read access ✨
]
```

## Setup Instructions

### 1. Get Google OAuth Credentials

**Google Cloud Console:** https://console.cloud.google.com/

1. Create project (or select existing)

2. Enable **Google Ads API** and **Google Analytics API**
   - Go to "APIs & Services" → "Library"
   - Search "Google Ads API" → Click "Enable"
   - Search "Google Analytics Data API" → Click "Enable"

3. Create OAuth 2.0 Credentials
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Type: **Web application**
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Copy Client ID and Client Secret

### 2. Configure Environment Variables

Add to `.env.local`:

```bash
# Google OAuth (Same credentials for auth, Google Ads API, AND Google Analytics API)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Google Ads Developer Token (still required - one token for all users)
GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"

# Anthropic API Key (for AI features)
ANTHROPIC_API_KEY="your-anthropic-api-key"

# ✅ REMOVED - No longer needed!
# These used to be required but OAuth handles them automatically now:
# GOOGLE_ADS_CLIENT_ID          ← Users provide via OAuth
# GOOGLE_ADS_CLIENT_SECRET      ← Users provide via OAuth
# GOOGLE_ADS_REFRESH_TOKEN      ← Users provide via OAuth
# GOOGLE_CLIENT_EMAIL           ← Not needed for OAuth
# GOOGLE_PRIVATE_KEY            ← Not needed for OAuth
# GA_PROPERTY_ID                ← Users will select their own
```

### 3. Get Developer Token

You still need a **Developer Token** from Google Ads:

1. Visit: https://ads.google.com/aw/apicenter
2. Request developer access
3. Add to `.env.local`:
   ```bash
   GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"
   ```

### 4. Test It!

```bash
npm run dev
open http://localhost:3000
```

Click "Sign in with Google" → You'll see:
- ✅ Request for email/profile
- ✅ **Request to manage Google Ads**
- ✅ After approval → Redirected to dashboard
- ✅ Dashboard can now access user's Google Ads data!

## Using the Tokens in API Calls

### Get User's Tokens from Session

```typescript
// In API routes or Server Components
import { auth } from "@/auth";

const session = await auth();
const accessToken = session?.accessToken;
const refreshToken = session?.refreshToken;

// Pass to Google Ads MCP client
const client = createGoogleAdsMCPClient({
  developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  // Use user's OAuth tokens instead of hardcoded ones!
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  refreshToken: session?.refreshToken,
});
```

### Update Chat API

```typescript
// app/api/ai/chat/route.ts
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Use user's tokens
  const googleAdsClient = createGoogleAdsMCPClient({
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    refreshToken: session.refreshToken, // User's token!
  });

  // Now fetches THEIR Google Ads data
  const campaigns = await googleAdsClient.getCampaigns(customerId);
}
```

## Features

### ✅ Automatic Token Refresh

Tokens expire after 1 hour. The system automatically refreshes them:

```typescript
// In auth.config.ts
async jwt({ token, account }) {
  // Check if expired
  if (Date.now() < token.accessTokenExpires) {
    return token; // Still valid
  }

  // Refresh automatically
  return await refreshAccessToken(token);
}
```

### ✅ Secure Token Storage

- Tokens stored in encrypted JWT
- Never exposed to client-side JavaScript
- Only accessible in server components and API routes

### ✅ Per-User Data Isolation

Each user only sees their own Google Ads accounts:
- User A signs in → Gets access to Account 123
- User B signs in → Gets access to Account 456
- No configuration needed - automatic!

## Sign-In Buttons

Three buttons available across the app:

1. **Hero CTA** (Large gradient button)
   ```tsx
   import { SignInButton } from "@/components/sign-in-button";
   <SignInButton />
   ```

2. **Header** (Compact nav button)
   ```tsx
   import { HeaderSignInButton } from "@/components/header-sign-in";
   <HeaderSignInButton />
   ```

3. **Bottom CTA** (White button for dark backgrounds)
   ```tsx
   import { CTASignInButton } from "@/components/cta-sign-in";
   <CTASignInButton />
   ```

## File Structure

```
├── auth.config.ts               # OAuth config with Google Ads scope
│   ├── refreshAccessToken()     # Auto-refresh expired tokens
│   └── callbacks                # Store & refresh tokens
├── auth.ts                      # NextAuth instance
├── middleware.ts                # Protect /dashboard routes
├── app/api/auth/[...nextauth]/
│   └── route.ts                 # Auth API handlers
└── components/
    ├── providers.tsx            # SessionProvider wrapper
    ├── sign-in-button.tsx       # Hero button
    ├── header-sign-in.tsx       # Nav button
    └── cta-sign-in.tsx          # CTA button
```

## Benefits

### Before (Manual Setup)
❌ Users had to:
1. Go to Google Cloud Console
2. Create OAuth credentials
3. Get refresh token manually
4. Copy/paste into app settings
5. Configure for each account

### After (Automatic OAuth)
✅ Users just:
1. Click "Sign in with Google"
2. Approve permissions
3. **Done!** Instant access to their Google Ads

## ✅ Already Implemented

All API routes now use user-specific OAuth tokens:

1. **✅ `/api/google-ads/campaigns`** - Uses session tokens
2. **✅ `/api/ai/chat`** - Uses session tokens for Google Ads
3. **✅ `/api/analytics/report`** - Uses session tokens for Analytics
4. **✅ Automatic token refresh** - Handles expired tokens

## Next Steps (Optional Enhancements)

1. **Add account selector**
   - User might have multiple Google Ads accounts
   - Let them choose which one to analyze

2. **Add sign-out button**
   ```tsx
   import { signOut } from "next-auth/react";
   <button onClick={() => signOut()}>Sign Out</button>
   ```

3. **Show user profile in dashboard**
   ```tsx
   const session = await auth();
   <p>Welcome, {session?.user?.name}!</p>
   ```

4. **Add GA property selector**
   - Users can select which Analytics property to analyze
   - Store preference in user settings

## Troubleshooting

### "Access Denied" when signing in

**Cause:** Google Ads API not enabled

**Fix:**
1. Go to Google Cloud Console
2. APIs & Services → Library
3. Search "Google Ads API"
4. Click "Enable"

### "Invalid Client" error

**Cause:** Wrong credentials or redirect URI

**Fix:**
1. Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
2. Verify redirect URI is exactly:
   ```
   http://localhost:3000/api/auth/callback/google
   ```

### Tokens not refreshing

**Cause:** No `refresh_token` in response

**Fix:** Ensure `access_type: "offline"` in auth config (already added)

## Security Notes

✅ **Tokens never exposed to client**
- Stored in encrypted JWT
- Only server can access

✅ **Automatic token refresh**
- No manual intervention needed
- Seamless user experience

✅ **Per-user isolation**
- Each user's tokens separate
- No cross-account access

## Summary

🎉 **Users can now sign in with Google and your app automatically gets permission to access their Google Ads accounts!**

- No manual API credential configuration
- Automatic token management
- Secure, per-user data access
- Professional OAuth flow

The "Sign in with Google" button now does it ALL! 🚀
