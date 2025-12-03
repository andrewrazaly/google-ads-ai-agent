# 🗺️ AdGenius AI - Navigation Guide

## Application Structure

The application has been designed with two completely separate experiences:

### 1. 🏠 Marketing Site
**URL:** [http://localhost:3000](http://localhost:3000)

A beautiful, modern SaaS landing page featuring:
- Hero section with gradient text and animations
- Feature showcase
- Stats section
- Testimonials
- Multiple CTAs

**Navigation Options:**
- **Top Nav Bar:**
  - "Sign In" → Links to `/dashboard`
  - "Launch Platform" → Links to `/dashboard`
- **Hero Section:**
  - "Launch Platform" (primary CTA) → Links to `/dashboard`
  - "Try It Now" (secondary CTA) → Links to `/dashboard`
- **Bottom CTA Section:**
  - "Launch Platform" → Links to `/dashboard`
  - "Try It Now" → Links to `/dashboard`

### 2. 🚀 AI Platform (Dashboard)
**URL:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

Google AI Studio-inspired interface featuring:
- **Left Sidebar:** AI task library (6 pre-built workflows)
- **Center Panel:** Chat interface with Claude AI
- **Right Sidebar:** Model & API settings

**Key Features:**
- No navigation back to marketing site
- Completely isolated experience
- Full-screen, immersive UI
- Dark theme optimized for focus

## User Flow

```
Marketing Page (localhost:3000)
        |
        | Click any "Launch Platform" or "Try It Now" button
        ↓
AI Dashboard (localhost:3000/dashboard)
        |
        | User stays in platform - no way to navigate back
        ↓
   Work with AI
```

## Design Philosophy

**Separation of Concerns:**
- Marketing site focuses on conversion and education
- Platform focuses on productivity and AI interaction
- No cross-navigation to prevent context switching
- Direct access to platform from multiple CTAs

**User Experience:**
- Users can bookmark `/dashboard` for direct access
- Once in the platform, full attention on AI tasks
- Clean, distraction-free workspace
- Google AI Studio aesthetic for familiarity

## Quick Access

### Development
```bash
# Start the dev server
npm run dev

# Marketing site
open http://localhost:3000

# AI Platform (direct access)
open http://localhost:3000/dashboard
```

### Production (Future)
```bash
# Marketing site
https://yourdomain.com

# AI Platform
https://yourdomain.com/dashboard
# or
https://app.yourdomain.com (if using subdomain)
```

## Notes

- All CTA buttons throughout the marketing site link to `/dashboard`
- Dashboard has zero links back to marketing site
- This prevents users from accidentally leaving their work
- Users who bookmark `/dashboard` can skip marketing entirely
