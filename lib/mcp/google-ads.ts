import { MCPClient } from "./client";

export interface GoogleAdsAccount {
  customerId: string;
  name: string;
  currencyCode?: string;
}

export interface GoogleAdsSearchResult {
  campaigns?: any[];
  adGroups?: any[];
  keywords?: any[];
  ads?: any[];
  metrics?: any[];
}

/**
 * Google Ads MCP Client
 *
 * Uses the official Google Ads MCP Server from:
 * https://github.com/googleads/google-ads-mcp
 *
 * This server provides:
 * - search: Retrieves information about Google Ads accounts
 * - list_accessible_customers: Returns customers directly accessible by the user
 *
 * Configuration is done via environment variables or database-stored credentials
 */
export class GoogleAdsMCPClient extends MCPClient {
  constructor(credentials?: {
    developerToken?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    loginCustomerId?: string;
  }) {
    // Use the official Google Ads MCP server
    // Repository: https://github.com/googleads/google-ads-mcp
    super({
      command: "uvx",
      args: ["google-ads-mcp"],
      env: {
        ...process.env,
        // Google Ads API credentials
        GOOGLE_ADS_DEVELOPER_TOKEN: credentials?.developerToken || process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "",
        GOOGLE_ADS_CLIENT_ID: credentials?.clientId || process.env.GOOGLE_ADS_CLIENT_ID || "",
        GOOGLE_ADS_CLIENT_SECRET: credentials?.clientSecret || process.env.GOOGLE_ADS_CLIENT_SECRET || "",
        GOOGLE_ADS_REFRESH_TOKEN: credentials?.refreshToken || process.env.GOOGLE_ADS_REFRESH_TOKEN || "",
        // Optional: Manager account ID for accessing client accounts
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: credentials?.loginCustomerId || process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || "",
      },
    });
  }

  /**
   * List all accessible customer accounts
   * Uses the official MCP server's "list_accessible_customers" tool
   */
  async listAccessibleCustomers(): Promise<GoogleAdsAccount[]> {
    try {
      const result = await this.callTool("list_accessible_customers", {});

      if (result.content?.[0]?.text) {
        const data = JSON.parse(result.content[0].text);
        return data.map((customer: any) => ({
          customerId: customer.resourceName?.split('/')[1] || customer.id,
          name: customer.descriptiveName || customer.name || "Unknown",
          currencyCode: customer.currencyCode,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error listing accessible customers:", error);
      throw error;
    }
  }

  /**
   * Search Google Ads API
   * Uses the official MCP server's "search" tool
   *
   * @param query - GAQL (Google Ads Query Language) query
   * @param customerId - Optional customer ID (without hyphens)
   */
  async search(query: string, customerId?: string): Promise<GoogleAdsSearchResult> {
    try {
      const params: any = { query };
      if (customerId) {
        params.customer_id = customerId;
      }

      const result = await this.callTool("search", params);

      if (result.content?.[0]?.text) {
        return JSON.parse(result.content[0].text);
      }

      return {};
    } catch (error) {
      console.error("Error searching Google Ads:", error);
      throw error;
    }
  }

  /**
   * Get campaigns for a customer
   * Convenience method using the search tool
   */
  async getCampaigns(customerId: string): Promise<any[]> {
    try {
      const query = `
        SELECT
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          campaign.bidding_strategy_type,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value
        FROM campaign
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.name
      `;

      const result = await this.search(query, customerId);
      return result.campaigns || [];
    } catch (error) {
      console.error("Error getting campaigns:", error);
      throw error;
    }
  }

  /**
   * Get ad groups for a campaign
   */
  async getAdGroups(customerId: string, campaignId?: string): Promise<any[]> {
    try {
      let query = `
        SELECT
          ad_group.id,
          ad_group.name,
          ad_group.status,
          ad_group.campaign,
          ad_group.cpc_bid_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions
        FROM ad_group
        WHERE ad_group.status != 'REMOVED'
      `;

      if (campaignId) {
        query += ` AND ad_group.campaign = 'customers/${customerId}/campaigns/${campaignId}'`;
      }

      query += ` ORDER BY ad_group.name`;

      const result = await this.search(query, customerId);
      return result.adGroups || [];
    } catch (error) {
      console.error("Error getting ad groups:", error);
      throw error;
    }
  }

  /**
   * Get keywords for an ad group
   */
  async getKeywords(customerId: string, adGroupId?: string): Promise<any[]> {
    try {
      let query = `
        SELECT
          ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type,
          ad_group_criterion.status,
          ad_group_criterion.quality_info.quality_score,
          ad_group_criterion.cpc_bid_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions
        FROM keyword_view
        WHERE ad_group_criterion.status != 'REMOVED'
      `;

      if (adGroupId) {
        query += ` AND ad_group_criterion.ad_group = 'customers/${customerId}/adGroups/${adGroupId}'`;
      }

      const result = await this.search(query, customerId);
      return result.keywords || [];
    } catch (error) {
      console.error("Error getting keywords:", error);
      throw error;
    }
  }

  /**
   * Get performance metrics for a date range
   */
  async getMetrics(
    customerId: string,
    startDate: string,
    endDate: string,
    level: "campaign" | "ad_group" | "keyword" = "campaign"
  ): Promise<any[]> {
    try {
      const query = `
        SELECT
          segments.date,
          ${level}.id,
          ${level}.name,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.average_cpc,
          metrics.average_cpm,
          metrics.ctr
        FROM ${level}
        WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
          AND ${level}.status != 'REMOVED'
        ORDER BY segments.date DESC
      `;

      const result = await this.search(query, customerId);
      return result.metrics || [];
    } catch (error) {
      console.error("Error getting metrics:", error);
      throw error;
    }
  }

  /**
   * Get account-wide statistics
   */
  async getAccountStats(customerId: string, startDate: string, endDate: string): Promise<any> {
    try {
      const query = `
        SELECT
          customer.id,
          customer.descriptive_name,
          customer.currency_code,
          customer.time_zone,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.average_cpc,
          metrics.ctr
        FROM customer
        WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      `;

      const result = await this.search(query, customerId);
      return result;
    } catch (error) {
      console.error("Error getting account stats:", error);
      throw error;
    }
  }
}

// Factory function to create client with user credentials
export function createGoogleAdsMCPClient(credentials?: {
  developerToken?: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  loginCustomerId?: string;
}): GoogleAdsMCPClient {
  return new GoogleAdsMCPClient(credentials);
}

// Singleton for default environment credentials
let defaultGoogleAdsMCPInstance: GoogleAdsMCPClient | null = null;

export function getGoogleAdsMCPClient(): GoogleAdsMCPClient {
  if (!defaultGoogleAdsMCPInstance) {
    defaultGoogleAdsMCPInstance = new GoogleAdsMCPClient();
  }
  return defaultGoogleAdsMCPInstance;
}

export async function disconnectGoogleAdsMCP(): Promise<void> {
  if (defaultGoogleAdsMCPInstance) {
    await defaultGoogleAdsMCPInstance.disconnect();
    defaultGoogleAdsMCPInstance = null;
  }
}
