import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AnalysisRequest {
  accountData: {
    campaigns: any[];
    metrics: any[];
    keywords?: any[];
    analytics?: any;
  };
  timeframe: string;
  goals?: string[];
}

export interface Recommendation {
  type: string;
  title: string;
  description: string;
  priority: number;
  estimatedImpact: string;
  actionableSteps: string[];
  metadata?: Record<string, any>;
}

export class GoogleAdsAIAgent {
  async analyzeAccount(request: AnalysisRequest): Promise<{
    insights: string[];
    recommendations: Recommendation[];
  }> {
    const prompt = this.buildAnalysisPrompt(request);

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return this.parseAnalysisResponse(content.text);
  }

  async generateAdCopy(params: {
    productName: string;
    targetAudience: string;
    keywords: string[];
    tone?: string;
  }): Promise<{
    headlines: string[];
    descriptions: string[];
  }> {
    const prompt = `Generate Google Ads copy for the following:

Product: ${params.productName}
Target Audience: ${params.targetAudience}
Keywords: ${params.keywords.join(", ")}
Tone: ${params.tone || "professional and engaging"}

Generate:
- 5 headlines (max 30 characters each)
- 3 descriptions (max 90 characters each)

Format as JSON:
{
  "headlines": [...],
  "descriptions": [...]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return JSON.parse(content.text);
  }

  async detectAnomalies(metrics: {
    current: any[];
    historical: any[];
    metric: string;
  }): Promise<{
    hasAnomaly: boolean;
    severity: "low" | "medium" | "high";
    explanation: string;
    suggestedActions: string[];
  }> {
    const prompt = `Analyze the following metrics for anomalies:

Metric: ${metrics.metric}
Current Data: ${JSON.stringify(metrics.current)}
Historical Data: ${JSON.stringify(metrics.historical)}

Detect any anomalies and provide:
1. Whether an anomaly exists
2. Severity level (low, medium, high)
3. Explanation of the anomaly
4. Suggested actions to address it

Format as JSON:
{
  "hasAnomaly": boolean,
  "severity": "low" | "medium" | "high",
  "explanation": string,
  "suggestedActions": [...]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return JSON.parse(content.text);
  }

  async naturalLanguageQuery(query: string, accountData: any): Promise<string> {
    const prompt = `You are a Google Ads analyst. Answer the following question based on the account data provided.

Question: ${query}

Account Data: ${JSON.stringify(accountData, null, 2)}

Provide a clear, concise answer with specific numbers and insights.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return content.text;
  }

  private buildAnalysisPrompt(request: AnalysisRequest): string {
    return `You are an expert Google Ads specialist and data analyst. Analyze the following Google Ads account data and provide actionable insights and recommendations.

Timeframe: ${request.timeframe}
${request.goals ? `Goals: ${request.goals.join(", ")}` : ""}

Campaign Data:
${JSON.stringify(request.accountData.campaigns, null, 2)}

Performance Metrics:
${JSON.stringify(request.accountData.metrics, null, 2)}

${request.accountData.keywords ? `Keywords: ${JSON.stringify(request.accountData.keywords, null, 2)}` : ""}

Please provide:
1. Key insights about account performance
2. Specific, actionable recommendations prioritized by impact
3. Estimated impact for each recommendation (high, medium, low)

Format your response as JSON:
{
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": [
    {
      "type": "bid_optimization|keyword_management|ad_copy|budget|targeting",
      "title": "Short title",
      "description": "Detailed description",
      "priority": 1-10,
      "estimatedImpact": "high|medium|low",
      "actionableSteps": ["step 1", "step 2", ...],
      "metadata": {}
    }
  ]
}`;
  }

  private parseAnalysisResponse(response: string): {
    insights: string[];
    recommendations: Recommendation[];
  } {
    try {
      const parsed = JSON.parse(response);
      return {
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
      };
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return {
        insights: ["Unable to parse AI response"],
        recommendations: [],
      };
    }
  }
}

export const aiAgent = new GoogleAdsAIAgent();
