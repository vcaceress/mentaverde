
import { GoogleGenAI } from "@google/genai";

// Fix: Always use new GoogleGenAI({ apiKey: process.env.API_KEY });
export const getAIResponse = async (userPrompt: string, context: 'security' | 'sql' = 'security') => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const instructions = context === 'sql' 
      ? "Eres un experto en bases de datos MySQL. Proporciona código SQL válido y optimizado. Explica conceptos como normalización e índices de forma breve y clara en español."
      : "Eres un asistente de seguridad servicial para Menta Verde. Sé conciso, profesional y amable. Ayuda a los usuarios con problemas de inicio de sesión y mejores prácticas de seguridad en español.";

    // Fix: Using gemini-3-flash-preview as per the instructions for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: instructions,
        temperature: 0.7,
      },
    });
    // Fix: Access .text property directly, it is not a method.
    return response.text || "Lo siento, no pude procesar esa solicitud.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "El asistente está descansando en este momento. Por favor, inténtalo más tarde.";
  }
};
