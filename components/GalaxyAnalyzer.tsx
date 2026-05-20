"use client";

import React, { useState, useRef } from 'react';
import { GALAXIES, Galaxy } from '@/lib/mockData';
import { AIOrchestrator, OrchestrationTrace } from '@/lib/AIOrchestrator';
import { UploadCloud, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Activity, Download, Layers, Shield } from 'lucide-react';

interface AnalyzerProps {
  onAnalyzingComplete?: (selected: Galaxy, report: any) => void;
}

export default function GalaxyAnalyzer({ onAnalyzingComplete }: AnalyzerProps) {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [analyzingState, setAnalyzingState] = useState<'idle' | 'uploading' | 'parsing' | 'complete'>('idle');
  const [selectedPreset, setSelectedPreset] = useState<Galaxy | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [customFileBytes, setCustomFileBytes] = useState<string>("");
  const [selectedSpectra, setSelectedSpectra] = useState<string[]>(["Optical", "Infrared"]);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [lastTrace, setLastTrace] = useState<OrchestrationTrace | null>(null);
  const [currentProgress, setCurrentProgress] = useState<string>("");
  const dynamicGalaxyIdCounter = useRef<number>(0);

  const presetTargetImages = [
    { name: "Andromeda M31 Core", id: "gal-002", size: "3.4 MB", ext: "FITS (Optical)", index: 0, url: "https://picsum.photos/seed/andromeda/500/300" },
    { name: "M87 Relativistic Jet", id: "gal-001", size: "12.8 MB", ext: "FITS (Radio/X-Ray)", index: 1, url: "https://picsum.photos/seed/m87/500/300" },
    { name: "Cosmic Lensed Arc A1689", id: "gal-003", size: "45.1 MB", ext: "FITS (Infrared)", index: 2, url: "https://picsum.photos/seed/lens/500/300" },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setUploadedFileName(file.name);
    setAnalyzingState('uploading');
    setSelectedPreset(null);
    setAiReport(null);

    // Conver to base64 for Gemini multimodal input parameter
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setCustomFileBytes(base64Data);
      
      // Simulate telescope ingest steps
      setTimeout(() => {
        setAnalyzingState('parsing');
        setCurrentProgress("ALIGNING INTERFEROMETERS & NOISE CORRECTION...");
        setTimeout(() => {
          setCurrentProgress("QUERYING GEMINI STRUCTURAL ANOMALY ENGINE...");
          triggerGeminiAnalysis(file.name, "Custom Spectral File", base64Data, file.type);
        }, 1200);
      }, 1000);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const selectPresetTarget = (preset: typeof presetTargetImages[0]) => {
    const matchedGalaxy = GALAXIES.find(g => g.id === preset.id) || GALAXIES[0];
    setSelectedPreset(matchedGalaxy);
    setUploadedFileName("");
    setAnalyzingState('parsing');
    setAiReport(null);
    setCurrentProgress("FETCHING MULTI-BAND CO-ADD GRID FROM PUBLIC DATA ARCHIVE...");

    setTimeout(() => {
      setCurrentProgress("RUNNING NEURAL ANOMALY DETECTOR...");
      triggerGeminiAnalysis(matchedGalaxy.name, matchedGalaxy.type, "", "", matchedGalaxy.spectralData);
    }, 1200);
  };

  const triggerGeminiAnalysis = async (
    name: string, 
    type: string, 
    imageBytes = "", 
    mimeType = "", 
    specData: number[] = []
  ) => {
    try {
      // Stream orchestration tracing pipeline in parallel
      const orchestratorPromise = AIOrchestrator.getInstance().orchestrateTask('anomaly_detection', {
        name,
        spectralData: specData.length > 0 ? specData : [50, 80, 110, 200, 310, 520, 680, 410, 230],
        wavebands: selectedSpectra,
        imageBytes
      });

      const responsePromise = fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          galaxyName: name,
          galaxyType: type,
          specData: specData.length > 0 ? specData : [50, 80, 110, 200, 310, 520, 680, 410, 230],
          imageBytes,
          mimeType,
          customPrompt: `Analyze wavebands: ${selectedSpectra.join(', ')}. Highlight anomalies.`
        })
      });

      const [orchResult, response] = await Promise.all([orchestratorPromise, responsePromise]);

      if (orchResult.success) {
        setLastTrace(orchResult.trace);
      }

      const data = await response.json();
      setAiReport(data.report);
      setAnalyzingState('complete');

      if (onAnalyzingComplete) {
        // Mock a newly created galaxy instance incorporating AI data
        dynamicGalaxyIdCounter.current += 1;
        const dynamicId = `ai-${dynamicGalaxyIdCounter.current}`;

        const dynamicGalaxy: Galaxy = {
          id: dynamicId,
          name: name,
          type: data.report.detectedType || "Anomalous Core",
          constellation: "Sagittarius Target Matrix",
          distance: "620 Mly",
          ra: "18h 44m 02s",
          dec: "-22° 11' 58\"",
          redshift: 0.145,
          anomalyScore: data.report.calculatedAnomalyScore || 72,
          status: (data.report.calculatedAnomalyScore || 72) > 75 ? "Critical Anomaly" : "Stable",
          spectralData: data.report.spectralFitCoefficients || [30, 50, 110, 180, 250, 420, 320, 510, 620, 780, 510, 240],
          description: data.report.observationSummary,
          color: (data.report.calculatedAnomalyScore || 72) > 75 ? "#ec4899" : "#10b981",
          coordinates: { x: 50, y: -20, z: 15 }
        };
        onAnalyzingComplete(dynamicGalaxy, data.report);
      }
    } catch (e) {
      console.error(e);
      setAnalyzingState('idle');
    }
  };

  const toggleSpectralWaveband = (band: string) => {
    if (selectedSpectra.includes(band)) {
      setSelectedSpectra(prev => prev.filter(b => b !== band));
    } else {
      setSelectedSpectra(prev => [...prev, band]);
    }
  };

  const resetAnalyzer = () => {
    setAnalyzingState('idle');
    setSelectedPreset(null);
    setUploadedFileName("");
    setCustomFileBytes("");
    setAiReport(null);
  };

  return (
    <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col h-full backdrop-blur-sm shadow-2xl" id="galaxy-analyzer-root">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-sans font-semibold text-lg text-white">SPECTRUM GALAXY INGESTION CORE</h2>
          <p className="text-xs text-slate-400">Upload telescope high-density FITS datasets or select telemetry presets to trigger anomaly detections.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-2xl text-cyan-400 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>NEURAL ACCELERATION: ONLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        {/* Left column: config & upload (7 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Config Ingest Wavebands</h3>
            <div className="grid grid-cols-3 gap-2">
              {["Optical", "X-Ray", "Infrared", "Radio", "Gamma-Ray", "Ultraviolet"].map(band => {
                const isSelected = selectedSpectra.includes(band);
                return (
                  <button
                    key={band}
                    onClick={() => toggleSpectralWaveband(band)}
                    className={`px-3 py-2 text-xs font-sans rounded-lg border transition-all text-center ${
                      isSelected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/10'
                    }`}
                    id={`band-toggle-${band.toLowerCase()}`}
                  >
                    {band}
                  </button>
                );
              })}
            </div>

            {/* Drag & Drop uploader */}
            {analyzingState === 'idle' && (
              <div 
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('telescope-file-input')?.click()}
                id="drop-zone"
              >
                <input
                  type="file"
                  id="telescope-file-input"
                  className="hidden"
                  accept="image/*,.fits,.fit"
                  onChange={handleFileInput}
                />
                <UploadCloud className="w-12 h-12 text-gray-500 mb-3 stroke-[1.2]" />
                <p className="font-sans font-medium text-xs text-[#F5F5F7] mb-1">Drag & Drop observatory file here</p>
                <p className="text-[10px] text-gray-500 font-mono">Supports FITS, TIFF, PNG up to 100MB</p>
                <span className="mt-4 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] font-mono rounded text-emerald-400 border border-white/10 uppercase">
                  Select terrestrial file
                </span>
              </div>
            )}

            {/* Neural scanning loading state */}
            {(analyzingState === 'uploading' || analyzingState === 'parsing') && (
              <div className="border border-white/10 bg-black/40 rounded-xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent animate-pulse pointer-events-none" />
                <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin mb-4 stroke-[1.2]" />
                <h4 className="font-mono text-xs text-[#F5F5F7] tracking-widest uppercase mb-1">
                  Ingesting Astro Telemetry...
                </h4>
                <p className="font-mono text-[9px] text-emerald-400 tracking-wider">
                  {currentProgress}
                </p>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mt-6">
                  <div className="h-full bg-emerald-400 rounded-full animate-infinite-loading w-2/3" />
                </div>
              </div>
            )}

            {/* Complete state */}
            {analyzingState === 'complete' && (
              <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 stroke-[1.2]" />
                <h4 className="font-sans font-bold text-sm text-[#F5F5F7] mb-1">SPECTRAL PARSING COMPLETED</h4>
                <p className="text-xs text-gray-400 mb-4">The raw image coordinates were successfully matched inside {"CosmicMind's"} catalog. Anomaly scores mapped.</p>
                <button
                  onClick={resetAnalyzer}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-mono border border-emerald-500/20 transition-all uppercase"
                  id="reset-analyzer-btn"
                >
                  Load another target
                </button>
              </div>
            )}
          </div>

          {/* Quick presets selectors */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">SELECT PRESET TELESCOPE SAMPLES</h3>
            <div className="flex flex-col gap-2">
              {presetTargetImages.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => selectPresetTarget(preset)}
                  className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-left transition-all"
                  id={`preset-target-${preset.id}`}
                >
                  <div>
                    <span className="block text-xs font-sans font-medium text-[#F5F5F7]">{preset.name}</span>
                    <span className="block text-[9px] font-mono text-gray-500 uppercase">{preset.ext}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 bg-emerald-400/10 rounded">
                    {preset.size}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Results display panel (7 cols) */}
        <div className="lg:col-span-7 bg-black/40 rounded-xl border border-white/10 p-5 flex flex-col justify-between">
          {!aiReport ? (
            <div className="flex flex-col items-center justify-center text-center h-full py-20 text-gray-500">
              <Cpu className="w-10 h-10 mb-3 text-gray-700 stroke-[1]" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Awaiting Telemetry Ingestion</p>
              <p className="text-[10px] text-gray-600 max-w-sm font-mono mt-1">
                Select a high-density target, or Drag & Drop local FITS files inside the uploader to compute thermal deviations.
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-sans font-bold text-base text-[#F5F5F7]">SPECTRAL TARGET CHARACTERIZATION</h3>
                  <p className="text-[9px] font-mono text-emerald-400 uppercase">IDENTIFIED SOURCE: {aiReport.detectedType}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-500">ANOMALY WEIGHT:</span>
                  <div className={`p-1.5 px-3 rounded text-xs font-mono font-bold ${
                    aiReport.calculatedAnomalyScore > 75 ? 'bg-pink-500/15 text-pink-400 border border-pink-500/20' : 'bg-emerald-500/15 text-[#10b981]'
                  }`}>
                    {aiReport.calculatedAnomalyScore}% MATCH
                  </div>
                </div>
              </div>

              {/* Observation Report text */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Neural Observations summary:</span>
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-gray-300 leading-relaxed">
                  {aiReport.observationSummary}
                </div>
              </div>

              {/* Localized Highlights alerts layout */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">FLAGGED CELESTIAL METRIC ABERRATIONS</span>
                <div className="space-y-2">
                  {aiReport.highlightedRegions && aiReport.highlightedRegions.map((reg: any, idx: number) => (
                    <div key={idx} className="flex gap-3 bg-red-950/20 border border-red-950/40 p-3 rounded-lg text-xs">
                      <AlertTriangle className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-mono font-bold text-[#F5F5F7]">{reg.region}</span>
                        <span className="block text-gray-400 mt-0.5">{reg.anomaly}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spectral mapping fits */}
              {aiReport.spectralFitCoefficients && (
                <div className="space-y-2.5 pt-3">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">MODEL DENSITY COEFFICIENTS</span>
                  <div className="grid grid-cols-6 gap-1 px-1 py-2 bg-black/60 rounded border border-white/5">
                    {aiReport.spectralFitCoefficients.slice(0, 12).map((val: number, idx: number) => (
                      <div key={idx} className="text-center">
                        <span className="block text-[8px] font-mono text-gray-600">CH-{idx+1}</span>
                        <span className="block text-[10px] font-mono text-emerald-400 font-bold">{val.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic AI Orchestrator Trace HUD Block */}
              {lastTrace && (
                <div className="mt-4 p-3.5 bg-cyan-950/20 border border-cyan-500/20 rounded-xl space-y-2.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between border-b border-cyan-500/10 pb-1.5 text-cyan-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      <span>Ingestion Pipeline Trace</span>
                    </span>
                    <span className="text-[8px]">{lastTrace.securityHash}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-gray-300">
                    <div>
                      <span className="text-gray-500 block text-[8px]">PROMPT DECISION:</span>
                      <p className="font-sans leading-relaxed text-gray-200 mt-0.5">{lastTrace.routingDecision}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[8px]">PRIMARY COMPASS MODEL:</span>
                      <p className="text-[#F5F5F7] mt-0.5 font-bold">{lastTrace.primaryModel}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] border-t border-cyan-500/10 pt-2 text-gray-400">
                    <span>PROCESSING SPEED: <strong className="text-cyan-400">{lastTrace.durationMs}ms</strong></span>
                    <span>NEURAL STABILITY: <strong className="text-emerald-400">100% SECURE</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {aiReport && (
            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-6">
              <span className="text-[9px] font-mono text-gray-600">CALCULATORS OPTIMIZED: z={aiReport.calculatedAnomalyScore > 75 ? '7.60' : '0.004'}</span>
              <button 
                onClick={() => alert("Simulating pipeline fits compilation. PDF/TXT download ready on production cluster.")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                id="export-pdf-btn"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EXPORT TELEMETRY</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
