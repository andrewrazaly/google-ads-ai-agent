# Setup Guide

This guide will walk you through setting up the Google Ads AI Agent application from scratch.

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Or use a cloud provider like [Supabase](https://supabase.com/) or [Neon](https://neon.tech/)

3. **Redis** (v6 or higher)
   - Download from [redis.io](https://redis.io/download)
   - Or use [Redis Cloud](https://redis.com/try-free/)

### Required API Credentials

#### 1. Google OAuth & Google Ads API

**Step 1: Create a Google Cloud Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Ads API
   - Google Analytics API

**Step 2: Create OAuth 2.0 Credentials**
1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - Your production URL + `/api/auth/callback/google`
5. Save the Client ID and Client Secret

**Step 3: Get Google Ads Developer Token**
1. Go to [Google Ads API Center](https://ads.google.com/aw/apicenter)
2. Apply for a developer token
3. Note: You may need a manager account for API access

**Step 4: Get Google Ads Refresh Token**
1. Use the OAuth 2.0 Playground or a tool like Postman
2. Request offline access with scopes: `https://www.googleapis.com/auth/adwords`
3. Exchange authorization code for refresh token

#### 2. Anthropic Claude API

1. Sign up at [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Copy the key (starts with `sk-ant-`)

#### 3. Google Analytics (via MCP - Optional)

If using MCP servers for Google Analytics:
1. Set up MCP server following MCP documentation
2. Note the server URL for configuration

## Installation Steps

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database - Use your PostgreSQL connection string
DATABASE_URL="postgresql://user:password@localhost:5432/google_ads_ai_agent"

# Redis - Use your Redis connection string
REDIS_URL="redis://localhost:6379"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"
GOOGLE_ADS_CLIENT_ID="your-oauth-client-id"
GOOGLE_ADS_CLIENT_SECRET="your-oauth-client-secret"
GOOGLE_ADS_REFRESH_TOKEN="your-refresh-token"

# Google Analytics
GOOGLE_ANALYTICS_PROPERTY_ID="GA4-PROPERTY-ID"

# Anthropic Claude API
ANTHROPIC_API_KEY="sk-ant-your-api-key"

# MCP Servers (Optional)
MCP_GOOGLE_ADS_SERVER_URL="http://localhost:8001"
MCP_GOOGLE_ANALYTICS_SERVER_URL="http://localhost:8002"
```

### 3. Set Up the Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Open Prisma Studio to view your database
npx prisma studio
```

### 4. Start Development Server

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000)

## Verification Steps

### 1. Test Database Connection
```bash
npx prisma studio
```
You should see the Prisma Studio interface with your database tables.

### 2. Test Application
1. Navigate to `http://localhost:3000`
2. Click "Sign In with Google"
3. Authorize the application
4. You should be redirected to the dashboard

### 3. Test API Routes
Create a test API route to verify Google Ads connection:

```bash
curl http://localhost:3000/api/test/google-ads
```

## Common Issues & Solutions

### Issue: Database Connection Failed
**Solution:**
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL format
- Ensure database exists: `createdb google_ads_ai_agent`

### Issue: Redis Connection Failed
**Solution:**
- Verify Redis is running: `redis-cli ping`
- Should return `PONG`
- Check REDIS_URL format

### Issue: Google Ads API Authentication Failed
**Solution:**
- Verify all Google credentials are correct
- Ensure refresh token has not expired
- Check that Google Ads API is enabled in Cloud Console

### Issue: Prisma Schema Changes Not Reflected
**Solution:**
```bash
npx prisma generate
npx prisma db push
```

## Next Steps

### Sprint 0 Tasks
1. ✅ Project setup complete
2. ⬜ Set up authentication with NextAuth.js
3. ⬜ Create Google Ads API integration module
4. ⬜ Set up Google Analytics MCP connection
5. ⬜ Create basic dashboard layout
6. ⬜ Implement data fetching hooks

### Development Workflow
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Test locally
4. Commit and push
5. Create pull request

### Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open database GUI
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes

# Linting
npm run lint         # Run ESLint
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [Anthropic Claude API Documentation](https://docs.anthropic.com/)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review [PROJECT_PLAN.md](PROJECT_PLAN.md) for architecture details
3. Contact the development team
