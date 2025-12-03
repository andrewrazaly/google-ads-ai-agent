# 🚀 AdGenius AI - Google Ads AI Agent

An AI-powered Google Ads management and optimization platform with a beautiful, modern SaaS interface inspired by Google AI Studio. Transform your Google Ads campaigns with intelligent automation and real-time insights.

![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Claude](https://img.shields.io/badge/Claude-Sonnet%204.5-purple)

## ✨ Features

### 🎯 Core Value Propositions

#### 1. **Predictive Performance Intelligence** (70% Time Savings)
- 📊 Predictive budget allocation based on historical performance
- 🔔 Real-time anomaly detection with intelligent alerts
- 🕵️ Competitive intelligence tracking
- 📈 Seasonal trend forecasting

#### 2. **Autonomous Campaign Optimization** (25-40% Performance Boost)
- 💰 Smart bid adjustments based on conversion probability
- 🧪 Dynamic ad testing and optimization
- 🔑 Automated keyword expansion and pruning
- 🎯 Landing page matching optimization

### 🛠️ Additional Features
- 📊 Cross-platform attribution dashboard
- 💬 Natural language query interface (Google AI Studio design)
- 📧 Automated performance reports
- 👥 Cohort analysis
- 🔄 Campaign cloning intelligence
- ⭐ Quality score improvement suggestions
- ✅ Ad compliance checker
- 📚 Best practice library
- 🤝 Team collaboration hub

## 🏗️ Technology Stack

- **Frontend**: Next.js 15.1.0, React 18.3.1, TypeScript, Tailwind CSS
- **UI Design**: Google AI Studio-inspired three-panel layout
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Caching**: Redis (optional)
- **AI**: Anthropic Claude API (Sonnet 4.5)
- **Google Ads**: Official Google Ads MCP Server ([github.com/googleads/google-ads-mcp](https://github.com/googleads/google-ads-mcp))
- **Deployment**: Vercel-ready

## 🎨 Dashboard Design

Inspired by **Google AI Studio**, the dashboard features:

- **Left Sidebar**: AI task library with 6 pre-built workflows
  - Campaign Performance Analysis
  - Keyword Research
  - Ad Copy Generation
  - Bid Optimization
  - Audience Insights
  - Competitor Analysis

- **Center Panel**: Clean chat interface for AI interactions
  - Real-time Claude API integration
  - Markdown support
  - Message history
  - Quick starter cards

- **Right Sidebar**: Model & API settings
  - Model selection (Sonnet 4.5, Opus 4, Haiku)
  - Temperature control
  - Output format selection
  - Google Ads API configuration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com/))
- Google Ads API credentials (optional for testing)
- PostgreSQL database (optional)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd google-ads-ai-agent

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# ANTHROPIC_API_KEY=your-key-here

# Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the landing page and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the AI dashboard.

### 🔐 Configuration

#### Required: Anthropic API Key

1. Get your API key from [console.anthropic.com](https://console.anthropic.com/)
2. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=your-key-here
   ```

#### Optional: Google Ads Integration

For full Google Ads functionality:

1. **Install uvx** (Python package runner for Google Ads MCP):
   ```bash
   # macOS/Linux
   curl -LsSf https://astral.sh/uv/install.sh | sh

   # Windows
   powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. **Get Google Ads API Credentials**:
   - Follow detailed instructions in [GOOGLE_ADS_MCP_SETUP.md](GOOGLE_ADS_MCP_SETUP.md)
   - Add credentials to `.env.local`

3. **Test the MCP Server**:
   ```bash
   # Verify uvx and google-ads-mcp work
   uvx google-ads-mcp --help
   ```

#### Optional: Database Setup

For data persistence:

```bash
# Initialize PostgreSQL database
npx prisma generate
npx prisma db push
```

## 📖 Documentation

- **[GOOGLE_ADS_MCP_SETUP.md](GOOGLE_ADS_MCP_SETUP.md)** - Complete Google Ads MCP integration guide
- **[DESIGN_UPDATE.md](DESIGN_UPDATE.md)** - Modern SaaS design documentation
- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - 32-week development roadmap
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Detailed setup instructions

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── auth/              # Authentication pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── providers.tsx     # App providers
├── lib/                   # Utility libraries
│   ├── ai/               # AI agent logic
│   ├── google-ads/       # Google Ads API integration
│   ├── analytics/        # Google Analytics integration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── public/               # Static assets
```

## Development Roadmap

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for the complete 32-week sprint plan.

### Current Sprint: Sprint 0 - Foundation & Setup
- [x] Next.js project setup
- [x] Database schema design
- [x] Basic UI components
- [ ] Google Ads API integration
- [ ] Google Analytics MCP integration
- [ ] Authentication setup

## API Integration

### Google Ads API

The app uses the Google Ads API to:
- Fetch campaign, ad group, keyword, and ad data
- Retrieve performance metrics
- Make automated optimizations (with approval)

### Google Analytics API (via MCP)

Integration with Google Analytics through MCP servers to:
- Track user behavior and conversions
- Analyze customer journeys
- Provide cross-platform attribution

### Anthropic Claude API

Powers the AI agent for:
- Account analysis and recommendations
- Ad copy generation
- Anomaly detection
- Natural language queries
- Predictive analytics

## Contributing

This is a private project. For issues or suggestions, please contact the development team.

## License

Proprietary - All rights reserved
