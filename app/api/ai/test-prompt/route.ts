import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { PROMPT_LIBRARY } from "@/lib/prompt-library";
import {
  syntheticSearchTermsData,
  syntheticNgramData,
  syntheticConvertingSearchTerms,
  formatSearchTermsForPrompt,
  formatNgramForPrompt,
  formatConvertingTermsForPrompt,
} from "@/lib/synthetic-data";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "demo-key",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { promptId } = body;

    if (!promptId) {
      return NextResponse.json(
        { error: "promptId is required" },
        { status: 400 }
      );
    }

    // Get the prompt configuration
    const promptConfig = PROMPT_LIBRARY[promptId as keyof typeof PROMPT_LIBRARY];
    if (!promptConfig) {
      return NextResponse.json(
        { error: "Invalid promptId" },
        { status: 400 }
      );
    }

    // Format the appropriate synthetic data
    let formattedData = "";
    switch (promptConfig.dataType) {
      case "searchTerms":
        formattedData = formatSearchTermsForPrompt(syntheticSearchTermsData);
        break;
      case "ngram":
        formattedData = formatNgramForPrompt(syntheticNgramData);
        break;
      case "convertingTerms":
        formattedData = formatConvertingTermsForPrompt(syntheticConvertingSearchTerms);
        break;
      default:
        formattedData = "No data available";
    }

    // Combine prompt with data
    const fullPrompt = `${promptConfig.promptText}\n\n## Data to Analyze:\n\n${formattedData}`;

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "demo-key") {
      return NextResponse.json({
        role: "assistant",
        content: `# Demo Mode - OpenAI API Key Not Configured

This is a demo response. To get actual AI analysis, add your OpenAI API key to .env.local:

\`\`\`
OPENAI_API_KEY=your-key-here
\`\`\`

Get a free key at: https://platform.openai.com/api-keys

---

## Demo Analysis for: ${promptConfig.title}

The AI would analyze the following data:

${formattedData}

And provide detailed insights based on the prompt:
${promptConfig.promptText.slice(0, 200)}...`,
        model: "demo",
        isDemo: true,
      });
    }

    // Call OpenAI API (using GPT-3.5-turbo for free tier)
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert Google Ads consultant specializing in campaign optimization and data analysis.",
        },
        {
          role: "user",
          content: fullPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "No response generated";

    return NextResponse.json({
      role: "assistant",
      content: content,
      model: response.model,
      usage: response.usage,
      promptUsed: promptConfig.title,
      dataType: promptConfig.dataType,
    });
  } catch (error: any) {
    console.error("Error in test prompt:", error);

    // Provide helpful error messages
    if (error.code === "invalid_api_key") {
      return NextResponse.json(
        {
          error: "Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env.local",
          details: error.message
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
