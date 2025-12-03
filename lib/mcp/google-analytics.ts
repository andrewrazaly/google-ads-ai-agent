import { MCPClient } from "./client";

export interface AnalyticsReport {
  dimensions: string[];
  metrics: string[];
  rows: any[];
}

export interface AnalyticsMetric {
  name: string;
  value: number;
}

export interface GoogleAnalyticsCredentials {
  // Service Account credentials (for shared/admin access)
  clientEmail?: string;
  privateKey?: string;
  propertyId?: string;
  // OAuth credentials (for per-user access)
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

export class GoogleAnalyticsMCPClient extends MCPClient {
  constructor(credentials?: GoogleAnalyticsCredentials) {
    // Use the official mcp-server-google-analytics package
    // Repository: https://github.com/ruchernchong/mcp-server-google-analytics
    // Install with: npx mcp-server-google-analytics

    // Support both Service Account and OAuth credentials
    const env: Record<string, string | undefined> = {
      ...process.env,
    };

    // If OAuth credentials are provided, use them
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

    if (credentials?.propertyId) {
      env.GA_PROPERTY_ID = credentials.propertyId;
    }

    super({
      command: "npx",
      args: ["mcp-server-google-analytics"],
      env,
    });
  }

  async getReport(
    propertyId: string,
    startDate: string,
    endDate: string,
    dimensions: string[],
    metrics: string[]
  ): Promise<AnalyticsReport> {
    try {
      const result = await this.callTool("google_analytics_run_report", {
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
        dimensions,
        metrics,
      });
      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : { dimensions: [], metrics: [], rows: [] };
    } catch (error) {
      console.error("Error getting Analytics report:", error);
      throw error;
    }
  }

  async getTrafficSources(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    try {
      const result = await this.callTool("google_analytics_get_traffic_sources", {
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
      });
      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
    } catch (error) {
      console.error("Error getting traffic sources:", error);
      throw error;
    }
  }

  async getConversions(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<any[]> {
    try {
      const result = await this.callTool("google_analytics_get_conversions", {
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
      });
      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
    } catch (error) {
      console.error("Error getting conversions:", error);
      throw error;
    }
  }

  async getUserBehavior(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<any> {
    try {
      const result = await this.callTool("google_analytics_get_user_behavior", {
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
      });
      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
    } catch (error) {
      console.error("Error getting user behavior:", error);
      throw error;
    }
  }

  async getAudienceMetrics(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<AnalyticsMetric[]> {
    try {
      const result = await this.callTool("google_analytics_get_audience_metrics", {
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
      });
      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
    } catch (error) {
      console.error("Error getting audience metrics:", error);
      throw error;
    }
  }

  async getCampaignPerformance(
    propertyId: string,
    startDate: string,
    endDate: string,
    campaignName?: string
  ): Promise<any[]> {
    try {
      const result = await this.callTool("google_analytics_get_campaign_performance", {
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
        ...(campaignName && { campaign_name: campaignName }),
      });
      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
    } catch (error) {
      console.error("Error getting campaign performance:", error);
      throw error;
    }
  }

  async getPageViews(
    propertyId: string,
    startDate: string,
    endDate: string,
    pagePath?: string
  ): Promise<any[]> {
    try {
      const result = await this.callTool("google_analytics_get_page_views", {
        property_id: propertyId,
        start_date: startDate,
        end_date: endDate,
        ...(pagePath && { page_path: pagePath }),
      });
      return result.content?.[0]?.text ? JSON.parse(result.content[0].text) : [];
    } catch (error) {
      console.error("Error getting page views:", error);
      throw error;
    }
  }

  async getRealtimeUsers(propertyId: string): Promise<number> {
    try {
      const result = await this.callTool("google_analytics_get_realtime_users", {
        property_id: propertyId,
      });
      const data = result.content?.[0]?.text ? JSON.parse(result.content[0].text) : null;
      return data?.activeUsers || 0;
    } catch (error) {
      console.error("Error getting realtime users:", error);
      throw error;
    }
  }
}

/**
 * Factory function to create a Google Analytics MCP client
 */
export function createGoogleAnalyticsMCPClient(
  credentials?: GoogleAnalyticsCredentials
): GoogleAnalyticsMCPClient {
  return new GoogleAnalyticsMCPClient(credentials);
}
