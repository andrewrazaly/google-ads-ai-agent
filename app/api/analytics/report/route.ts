import { NextRequest, NextResponse } from "next/server";
import { createGoogleAnalyticsMCPClient } from "@/lib/mcp";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    // Get user session with OAuth tokens
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - please sign in with Google" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId, startDate, endDate, dimensions, metrics } = body;

    if (!propertyId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "propertyId, startDate, and endDate are required" },
        { status: 400 }
      );
    }

    // Create MCP client with user's OAuth tokens
    const mcpClient = createGoogleAnalyticsMCPClient({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: session.refreshToken,
      propertyId: propertyId,
    });
    await mcpClient.connect();

    const report = await mcpClient.getReport(
      propertyId,
      startDate,
      endDate,
      dimensions || ["date"],
      metrics || ["sessions", "users", "conversions"]
    );

    await mcpClient.disconnect();

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    console.error("Error fetching Analytics report:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch Analytics report",
      },
      { status: 500 }
    );
  }
}
