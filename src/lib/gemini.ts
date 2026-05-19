import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getMarketAnalysis = async (marketData: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are 'Stocky', a sophisticated financial AI analyst. 
      Analyze the following market data and provide a concise summary including:
      1. Overall Trend
      2. Key Indicators to watch
      3. A personalized recommendation for a diversified portfolio.
      
      Market Data:
      ${marketData}
      
      Format the output in clean markdown.`,
    });

    return response.text;
  } catch (error) {
    console.error("Error in Stocky analysis:", error);
    return "Stocky is currently taking a coffee break. Please try again in a moment.";
  }
};
