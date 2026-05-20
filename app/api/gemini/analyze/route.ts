import { getGeminiClient } from "@/lib/gemini";
import { Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { galaxyName, galaxyType, specData, imageBytes, mimeType, customPrompt } = await req.json();
    const ai = getGeminiClient();

    const systemInstruction = `You are the CosmicMind Neural Galaxy Ingestion Core, an analytical neural pipeline operating at "NASA meets Palantir" capacity.
Analyze the provided astronomical target and return a scientifically-consistent anomaly report in JSON format.
Identify unique morphological features, calculate exact pixel-level or spectrum anomalies (0 to 100%), outline coordinates or regions of extreme gamma/X-ray deflection, and write standard physics observation summaries.`;

    const promptText = `Analyze target galaxy. 
Target Identification: ${galaxyName || "Deep Space Transient"}
Catalogued Galaxy Type: ${galaxyType || "Spectral Anomaly Core"}
Input Spectral Series: ${specData ? JSON.stringify(specData) : "Dynamic multi-frequency curve"}
Custom Observatory Notes: ${customPrompt || "Perform baseline multi-band morphological analysis"}`;

    // Set up standard multimodal parts
    const parts: any[] = [];

    if (imageBytes && mimeType) {
      parts.push({
        inlineData: {
          data: imageBytes,
          mimeType: mimeType
        }
      });
    }

    parts.push({
      text: promptText
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedType: {
              type: Type.STRING,
              description: "The calculated morphological galaxy division, such as Active Nucleus, Lensed Ring, or Standard Spiral"
            },
            calculatedAnomalyScore: {
              type: Type.NUMBER,
              description: "Calibrated systemic anomaly index from 0 to 100"
            },
            highlightedRegions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  region: { type: Type.STRING, description: "Celestial coordinate delta, e.g. Core Jet offset at T-2" },
                  anomaly: { type: Type.STRING, description: "Observed cosmic deviation details" }
                },
                required: ["region", "anomaly"]
              },
              description: "Localized thermal or structural aberrations detected in the telescope frame"
            },
            observationSummary: {
              type: Type.STRING,
              description: "A highly elegant, cinematic, NASA-inspired peer-review summary detailing the observations in clean natural prose"
            },
            spectralFitCoefficients: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
              description: "A series of 12 normalized intensity coefficients mapping fit variations"
            }
          },
          required: ["detectedType", "calculatedAnomalyScore", "highlightedRegions", "observationSummary"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from multi-band reasoning core.");
    }

    const report = JSON.parse(responseText.trim());
    return NextResponse.json({
      report,
      processedAt: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("[CosmicMind Ingestion Core Error]:", error);
    
    // Graceful scientific fallback when API key is unconfigured or returns error
    const fallbackScore = Math.floor(Math.random() * 40) + 55; // 55-95
    return NextResponse.json({
      report: {
        detectedType: "Lensed Starburst Ring Core (Simulated)",
        calculatedAnomalyScore: fallbackScore,
        highlightedRegions: [
          { region: "Offset +0.44s RA / -0.12\" Dec", anomaly: "High concentration of ionized hydrogen emission flux" },
          { region: "Relativistic Accretion Cone Edge", anomaly: "Blueshifted synchrotron frequency turbulence at Keplerian limit" }
        ],
        observationSummary: "Telescope multi-band data successfully aligned via dynamic telemetry model. High concentration of energetic dust rings found around the core. Radio emissions display mild flux variances suggesting regular accretion disc turbulence and active gravitational lensing, with warning indicators active on relativistic jets.",
        spectralFitCoefficients: [45, 62, 110, 185, 230, 310, 290, 420, 580, 920, 810, 450].map(v => v * (1 + (Math.random() * 0.2 - 0.1)))
      },
      processedAt: new Date().toISOString(),
      simulated: true,
      errorFeedback: error.message || String(error)
    });
  }
}
