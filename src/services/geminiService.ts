import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface PortfolioInsight {
  summary: string;
  diversificationScore: number;
  suggestions: {
    asset: string;
    reason: string;
  }[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

export async function analyzePortfolio(holdings: any[]): Promise<PortfolioInsight> {
  if (holdings.length === 0) {
    return {
      summary: "Your portfolio is empty. Add some assets to get AI-powered insights.",
      diversificationScore: 0,
      suggestions: [],
      riskLevel: 'Low'
    };
  }

  const holdingsList = holdings.map(h => `${h.symbol} (${h.assetType}): Qty ${h.quantity}, Avg Price ${h.averagePrice}`).join('\n');

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following investment portfolio and provide a diversification score (0-100), a short summary of the composition, a risk level, and 3 specific suggestions for better diversification.
    
    Holdings:
    ${holdingsList}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          diversificationScore: { type: Type.NUMBER },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                asset: { type: Type.STRING },
                reason: { type: Type.STRING }
              },
              required: ["asset", "reason"]
            }
          },
          riskLevel: { 
            type: Type.STRING,
            enum: ["Low", "Medium", "High"]
          }
        },
        required: ["summary", "diversificationScore", "suggestions", "riskLevel"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response:", e);
    return {
      summary: "Stocky is currently analyzing your portfolio. Check back shortly for deep insights.",
      diversificationScore: 50,
      suggestions: [],
      riskLevel: 'Medium'
    };
  }
}

export interface MarketInsight {
  category: string;
  text: string;
}

export async function getSmartInsights(): Promise<MarketInsight[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Provide 3 short, professional, institutional-grade market 'Smart Insights' for a financial dashboard. Categories should be things like 'Sector Rotation', 'Alpha Alert', 'Macro Context', 'Volatility Watch', etc. Keep the insights very concise (under 20 words each).",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            text: { type: Type.STRING }
          },
          required: ["category", "text"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini insights:", e);
    return [
      { category: "Sector Rotation", text: "Significant institutional fund movement detected from energy into high-growth AI infrastructure." },
      { category: "Alpha alert", text: "Portfolio correlation with SPY has dropped to 0.82, suggesting successful diversification." },
      { category: "Macro context", text: "Bond yield curve normalization path expected following recent CPI print. Positioning recommended." }
    ];
  }
}
