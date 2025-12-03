import { NextRequest, NextResponse } from "next/server";
import { createGoogleAdsMCPClient } from "@/lib/mcp";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    // Get user session with OAuth tokens
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - please sign in with Google" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        { error: "customerId is required" },
        { status: 400 }
      );
    }

    // Create MCP client with user's OAuth tokens
    const mcpClient = createGoogleAdsMCPClient({
      developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: session.refreshToken,
    });

    await mcpClient.connect();

    const campaigns = await mcpClient.getCampaigns(customerId);

    await mcpClient.disconnect();

    return NextResponse.json({
      success: true,
      data: campaigns,
    });
  } catch (error: any) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch campaigns",
      },
      { status: 500 }
    );
  }
}

// Campaign creation is not yet supported by the Google Ads MCP server
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { customerId, ...campaignData } = body;

//     if (!customerId) {
//       return NextResponse.json(
//         { error: "customerId is required" },
//         { status: 400 }
//       );
//     }

//     const mcpClient = getGoogleAdsMCPClient();
//     await mcpClient.connect();

//     const result = await mcpClient.createCampaign(customerId, campaignData);

//     return NextResponse.json({
//       success: true,
//       data: result,
//     });
//   } catch (error: any) {
//     console.error("Error creating campaign:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message || "Failed to create campaign",
//       },
//       { status: 500 }
//     );
//   }
// }
