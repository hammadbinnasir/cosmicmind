import { GoogleGenAI } from "@google/genai";

// Lazy-initialized server-side Gemini AI Client
let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    // If the GEMINI_API_KEY is not configured, we'll log a warning, 
    // but proceed to avoid crashing. 
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[CosmicMind Service] Warning: GEMINI_API_KEY environment variable is not set.");
    }

    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "MOCK_API_KEY_AI_STUDIO_BACKUP",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}
