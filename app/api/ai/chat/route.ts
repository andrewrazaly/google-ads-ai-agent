import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createGoogleAdsMCPClient } from "@/lib/mcp/google-ads";
import { createGoogleAnalyticsMCPClient } from "@/lib/mcp/google-analytics";
import { auth } from "@/auth";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    // TEMPORARILY DISABLED FOR UI/UX DEVELOPMENT
    // Get user session with OAuth tokens
    // const session = await auth();

    // if (!session?.accessToken) {
    //   return NextResponse.json(
    //     { error: "Unauthorized - please sign in with Google" },
    //     { status: 401 }
    //   );
    // }

    const body = await request.json();
    const { messages, model = "claude-sonnet-4-5-20250929", temperature = 1, task, customerId } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        {
          error: "Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file.",
          docs: "Get your API key from https://console.anthropic.com/"
        },
        { status: 500 }
      );
    }

    // Initialize MCP clients and fetch data if needed
    let mcpContext = "";
    if (task && customerId) {
      try {
        // Google Ads MCP Client - TEMPORARILY using env vars for UI/UX development
        const googleAdsClient = createGoogleAdsMCPClient({
          developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
          clientId: process.env.GOOGLE_ADS_CLIENT_ID,
          clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN,
        });

        await googleAdsClient.connect();

        // Google Analytics MCP Client (optional) - TEMPORARILY using env vars
        let googleAnalyticsClient;
        const gaPropertyId = process.env.GA_PROPERTY_ID;
        if (gaPropertyId && process.env.GOOGLE_CLIENT_EMAIL) {
          googleAnalyticsClient = createGoogleAnalyticsMCPClient({
            clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
            privateKey: process.env.GOOGLE_PRIVATE_KEY,
            propertyId: gaPropertyId,
          });
          await googleAnalyticsClient.connect();
        }

        // Calculate date ranges
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const startDate = thirtyDaysAgo.toISOString().split("T")[0];
        const endDate = new Date().toISOString().split("T")[0];

        // Fetch relevant data based on task
        switch (task) {
          case "campaign-spend-review":
          case "ad-group-spend-review":
            const campaigns = await googleAdsClient.getCampaigns(customerId);
            const metrics = await googleAdsClient.getMetrics(customerId, startDate, endDate, "campaign");
            mcpContext = `\n\n## Google Ads Data\n\nCampaigns:\n${JSON.stringify(campaigns, null, 2)}\n\nMetrics:\n${JSON.stringify(metrics, null, 2)}`;
            break;

          case "search-term-audit":
          case "keyword-review":
          case "keyword-quality-score":
            const keywords = await googleAdsClient.getKeywords(customerId);
            const keywordMetrics = await googleAdsClient.getMetrics(customerId, startDate, endDate, "keyword");
            mcpContext = `\n\n## Google Ads Data\n\nKeywords:\n${JSON.stringify(keywords, null, 2)}\n\nKeyword Metrics:\n${JSON.stringify(keywordMetrics, null, 2)}`;
            break;

          case "ad-split-tests":
          case "ad-quality-check":
          case "ad-assets-review":
            const adGroupMetrics = await googleAdsClient.getMetrics(customerId, startDate, endDate, "ad_group");
            mcpContext = `\n\n## Google Ads Data\n\nAd Group Performance:\n${JSON.stringify(adGroupMetrics, null, 2)}`;
            break;

          default:
            // General campaign overview
            const generalCampaigns = await googleAdsClient.getCampaigns(customerId);
            mcpContext = `\n\n## Google Ads Data\n\nCampaigns:\n${JSON.stringify(generalCampaigns, null, 2)}`;
        }

        // Add Google Analytics data if available
        if (googleAnalyticsClient && process.env.GA_PROPERTY_ID) {
          try {
            const gaMetrics = await googleAnalyticsClient.getUserBehavior(
              process.env.GA_PROPERTY_ID,
              startDate,
              endDate
            );
            mcpContext += `\n\n## Google Analytics Data\n\nUser Behavior:\n${JSON.stringify(gaMetrics, null, 2)}`;
          } catch (gaError) {
            console.error("Error fetching GA data:", gaError);
          }
        }

        await googleAdsClient.disconnect();
        if (googleAnalyticsClient) await googleAnalyticsClient.disconnect();
      } catch (error) {
        console.error("Error fetching MCP data:", error);
        // Continue without MCP context if there's an error
      }
    }

    // Add system context for Google Ads tasks
    const systemMessage = `You are AdGenius AI, an expert Google Ads optimization assistant using the S.T.A.B method (Spending, Targeting, Ads, Bidding).

Your Expertise:
- Campaign and ad group performance analysis
- Keyword research and search term audits
- Ad copy optimization and split testing
- Bidding strategy recommendations
- Quality score improvements
- Location, device, audience, and demographic targeting
- Ad assets/extensions optimization
- Landing page analysis
- Quality control checks

Guidelines:
- Provide specific, actionable recommendations with clear next steps
- Use data-driven insights from Google Ads and Analytics metrics
- Reference key metrics: CTR, CPC, CPA, ROAS, conversion rate, quality score, impression share
- Follow S.T.A.B optimization framework for systematic analysis
- Prioritize high-impact optimizations first
- Flag any critical issues (disapproved ads, broken tracking, budget issues)

${mcpContext}`;

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: any) => ({
      role: (msg.role === "user" ? "user" : "assistant") as "user" | "assistant",
      content: msg.content,
    }));

    // Call Claude API
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 4096,
      temperature: temperature,
      system: systemMessage,
      messages: anthropicMessages,
    });

    // Extract text content
    const content = response.content
      .filter((block) => block.type === "text")
      .map((block: any) => block.text)
      .join("\n");

    return NextResponse.json({
      role: "assistant",
      content: content,
      model: response.model,
      usage: response.usage,
    });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
