import { NextRequest, NextResponse } from "next/server";
import { aiAgent } from "@/lib/ai/agent";
import { getGoogleAdsMCPClient, createGoogleAnalyticsMCPClient } from "@/lib/mcp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, propertyId, timeframe, goals } = body;

    if (!customerId) {
      return NextResponse.json(
        { error: "customerId is required" },
        { status: 400 }
      );
    }

    // Fetch Google Ads data via MCP
    const adsMCPClient = getGoogleAdsMCPClient();
    await adsMCPClient.connect();

    const campaigns = await adsMCPClient.getCampaigns(customerId);

    // Fetch campaign metrics for the last 30 days
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    // Fetch metrics for all campaigns
    const metrics = await adsMCPClient.getMetrics(
      customerId,
      startDate,
      endDate,
      "campaign"
    );

    // Optionally fetch Analytics data if propertyId provided
    let analyticsData = null;
    if (propertyId) {
      const analyticsMCPClient = createGoogleAnalyticsMCPClient({
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_PRIVATE_KEY,
        propertyId: process.env.GA_PROPERTY_ID,
      });
      await analyticsMCPClient.connect();

      analyticsData = await analyticsMCPClient.getReport(
        propertyId,
        startDate,
        endDate,
        ["source", "medium", "campaign"],
        ["sessions", "users", "conversions", "totalRevenue"]
      );
    }

    // Use AI agent to analyze the data
    const analysis = await aiAgent.analyzeAccount({
      accountData: {
        campaigns,
        metrics,
        analytics: analyticsData,
      },
      timeframe: timeframe || "last_30_days",
      goals: goals || [],
    });

    return NextResponse.json({
      success: true,
      data: {
        insights: analysis.insights,
        recommendations: analysis.recommendations,
        summary: {
          totalCampaigns: campaigns.length,
          timeframe: `${startDate} to ${endDate}`,
          hasAnalyticsData: !!analyticsData,
        },
      },
    });
  } catch (error: any) {
    console.error("Error analyzing account:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to analyze account",
      },
      { status: 500 }
    );
  }
}
