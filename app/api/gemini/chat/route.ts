import { getGeminiClient } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();
    const ai = getGeminiClient();

    const systemInstruction = `You are CosmicMind AI, an elite astrophysics research assistant and galaxy intelligence system. 
You think like an expert astrophysicist, World-Class AI architect, and Silicon Valley space systems designer.
Provide mathematically precise, authentic, and scientifically authoritative answers. 
Maintain a sleek, professional, NASA-inspired tone. Avoid promotional language or simplistic advice. 
When explaining, include where applicable: orbital mechanics, gravitational lensing, right ascensions (RA), declinations (Dec), redshifts, or high-energy spectral elements. 
Support markup lists, table figures, and LaTeX style formulas (e.g., $E = mc^2$ or $R_s = \\frac{2GM}{c^2}$).`;

    // Reconstruct conversation contents strictly according to @google/genai guidelines
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === "model" ? "model" : "user",
          parts: [{ text: h.text || h.message || "" }]
        });
      }
    }
    
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const text = response.text || "Cosmic signal received but content could not be decoded.";

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("[CosmicMind Chat Server Error]:", error);
    return NextResponse.json({
      message: "The astrophysics NLP module encountered terminal noise. Cosmic horizon unreachable.",
      error: error.message || String(error)
    }, { status: 500 });
  }
}
