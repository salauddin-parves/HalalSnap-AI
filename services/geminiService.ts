import { GoogleGenAI, Type } from "@google/genai";
import { ProductAnalysis, ScanStatus } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING },
    status: { type: Type.STRING, enum: ["HALAL", "DOUBTFUL", "HARAM"] },
    confidenceScore: { type: Type.INTEGER },
    reason: { type: Type.STRING },
    scholarNote: { type: Type.STRING },
    ingredients: { 
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    alternatives: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    origin: { type: Type.STRING },
    certification: { type: Type.STRING }
  }
};

export const analyzeProductImage = async (base64Image: string): Promise<ProductAnalysis> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this product image for Halal compliance. 
    1. Identify the product name.
    2. Identify the Country of Origin if visible (e.g., "Made in UK", "Product of USA").
    3. Look for Halal Certification logos or text (e.g., "Halal Certified", "IFANCA", "HMC").
    4. Check ingredients for any haram or doubtful substances (e.g., alcohol, animal rennet, gelatin, carmine, emulsifiers of unknown origin like E471).
    5. Provide a confidence score (0-100) based on how clearly the ingredients/product can be identified.
    6. Determine status: HALAL, DOUBTFUL, or HARAM.
    7. Provide a scholar note with advice.
    8. Suggest 3 Halal alternatives if the product is not clearly Halal.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const result = JSON.parse(text);
    return {
        ...result,
        status: result.status as ScanStatus
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return createFallbackError();
  }
};

export const analyzeIngredientText = async (textInput: string): Promise<ProductAnalysis> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following text (ingredients list or product name) for Halal compliance: "${textInput}".
    Determine status: HALAL, DOUBTFUL, or HARAM.
    Identify the product name if mentioned, otherwise use "Text Analysis".
    Highlight specific ingredients that cause concern.
    Infer origin or certification if mentioned in the text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    const result = JSON.parse(text);
    return { ...result, status: result.status as ScanStatus };
  } catch (error) {
    console.error("Gemini Text Analysis Error:", error);
    return createFallbackError();
  }
};

export const analyzeMenuImage = async (base64Image: string): Promise<any> => {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Analyze this restaurant menu. 
      Check if there are any "Halal Certified" claims or logos.
      Check if alcohol is served (beer, wine, spirits, cocktails).
      Assess cross-contamination risk based on the presence of pork or alcohol on the menu.
      Provide a brief analysis note.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: {
          parts: [
            { inlineData: { mimeType: "image/jpeg", data: base64Image } },
            { text: prompt }
          ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    restaurantName: { type: Type.STRING },
                    isHalalCertifiedClaim: { type: Type.BOOLEAN },
                    alcoholServed: { type: Type.BOOLEAN },
                    crossContaminationRisk: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
                    notes: { type: Type.STRING }
                }
            }
        }
      });
  
      const text = response.text;
      if (!text) throw new Error("No response");
      return JSON.parse(text);

    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  };

export const askScholar = async (question: string, context: string): Promise<string> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    You are a friendly and knowledgeable Halal food scholar AI assistant.
    The user is asking a question about a product with this analysis context:
    ${context}

    User Question: "${question}"

    Provide a concise, helpful answer (max 3 sentences). Explain specific E-codes or ingredients if asked. 
    Be polite and definitive where possible, but advise caution if unsure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] }
    });
    return response.text || "I couldn't generate an answer. Please try again.";
  } catch (e) {
    console.error(e);
    return "Sorry, I am having trouble connecting to the scholar network at the moment.";
  }
};

const createFallbackError = (): ProductAnalysis => ({
    productName: "Analysis Failed",
    status: ScanStatus.DOUBTFUL,
    confidenceScore: 0,
    reason: "Could not analyze. Please try again with clearer input.",
    scholarNote: "Manual verification recommended.",
    ingredients: [],
    alternatives: [],
    origin: "Unknown",
    certification: "None"
});