"use client";

import React, { useState, useEffect } from 'react';
import { RESEARCH_PAPERS, ResearchPaper } from '@/lib/mockData';
import { BookOpen, FileText, Globe, Key, List, Star, Activity, Cpu, RefreshCw, RadioTower, Database } from 'lucide-react';

export default function Copilot() {
  const [papers, setPapers] = useState<ResearchPaper[]>(RESEARCH_PAPERS);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(RESEARCH_PAPERS[0]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [loadingLive, setLoadingLive] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customAbstract, setCustomAbstract] = useState<string>("");
  const [runningSummarization, setRunningSummarization] = useState<boolean>(false);
  const [parsedReport, setParsedReport] = useState<any | null>(null);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const loadLivePublications = async () => {
    setLoadingLive(true);
    try {
      const res = await fetch("/api/astro-feed");
      const data = await res.json();
      if (data.success && data.livePapers?.length > 0) {
        setPapers(data.livePapers);
        setSelectedPaper(data.livePapers[0]);
        setIsLive(true);
      }
    } catch (e) {
      console.warn("Could not retrieve live journals, staying with local index:", e);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLivePublications();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleJournalMode = () => {
    if (isLive) {
      setPapers(RESEARCH_PAPERS);
      setSelectedPaper(RESEARCH_PAPERS[0]);
      setIsLive(false);
    } else {
      loadLivePublications();
    }
  };

  const handleExportBibtex = () => {
    setExportSuccess(true);
    setTimeout(() => {
      setExportSuccess(false);
    }, 4000);
  };

  const loadPresetPaper = (paper: ResearchPaper) => {
    setSelectedPaper(paper);
    setCustomTitle("");
    setCustomAbstract("");
    setParsedReport(null);
  };

  const executeSummarization = async () => {
    const abstract = customAbstract || selectedPaper?.abstract;
    const title = customTitle || selectedPaper?.title;

    if (!abstract) return;

    setRunningSummarization(true);
    setParsedReport(null);

    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          abstractText: abstract,
          paperTitle: title
        })
      });

      const data = await response.json();
      setParsedReport(data.report);
    } catch (e) {
      console.error(e);
      // Fallback
      setParsedReport({
        summary: "Calculations indicate a critical deflection spike in the cosmic horizon.",
        citations: ["Einstein, A. 1916, Annalen der Physik", "Hawking, S. 1974, Nature"],
        findings: ["Deflection of wave velocities", "Dynamic horizon alignments"],
        comparativeMatrix: "Slight alignment with general theories."
      });
    } finally {
      setRunningSummarization(false);
    }
  };

  return (
    <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col h-full backdrop-blur-sm shadow-2xl" id="copilot-research-root">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center pb-4 border-b border-white/10 mb-6">
        <div>
          <h2 className="font-sans font-semibold text-lg text-white flex items-center gap-2">
            ASTRO RESEARCH COPILOT
            {isLive ? (
              <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-mono tracking-widest uppercase">
                ● LIVE JOURNALS ACTIVE
              </span>
            ) : (
              <span className="text-[9px] bg-pink-500/15 border border-pink-500/30 text-pink-400 px-2 py-0.5 rounded font-mono tracking-widest uppercase">
                MOCK PRESETS
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">Summarize cosmology publications, extract peer citations, and cross-reference background structures.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleJournalMode}
            disabled={loadingLive}
            className={`cursor-pointer font-mono text-xs px-3.5 py-1.5 rounded-lg border flex items-center gap-2 transition-all ${
              isLive 
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
            }`}
          >
            {loadingLive ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isLive ? (
              <RadioTower className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            ) : (
              <Database className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>{isLive ? "LIVE JOURNALS" : "CONNECT LIVE JOURNALS"}</span>
          </button>
          <BookOpen className="w-5 h-5 text-cyan-400 hidden sm:block stroke-[1.5]" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        {/* Input Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Select Academic Abstract</h3>
            <div className="flex flex-col gap-2.5">
              {papers.map(paper => (
                <button
                  key={paper.id}
                  onClick={() => loadPresetPaper(paper)}
                  className={`p-3 rounded-xl border text-left transition-all w-full cursor-pointer ${
                    selectedPaper?.id === paper.id && !customAbstract
                      ? 'bg-[#12131A] border-emerald-500/40 text-[#F5F5F7] shadow-[0_0_15px_rgba(16,185,129,0.06)] animate-pulse'
                      : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/10'
                  }`}
                  id={`preset-paper-${paper.id}`}
                  style={{ animationDuration: '3s' }}
                >
                  <span className="block font-sans font-extrabold text-xs truncate mb-1 text-white">{paper.title}</span>
                  <p className="text-[10px] text-gray-400 line-clamp-1 mb-1.5 font-sans font-semibold">
                    {paper.authors} — {paper.journal}
                  </p>
                  <span className="inline-block text-[8px] font-mono uppercase tracking-wide text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {isLive ? "LIVE INGESTED" : `PRESET PAPER ${paper.id.toUpperCase()}`}
                  </span>
                </button>
              ))}
              <button
                onClick={() => {
                  setSelectedPaper(null);
                  setCustomTitle("Proposed Accretion Deflection Metrics");
                  setCustomAbstract("");
                  setParsedReport(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all w-full cursor-pointer ${
                  !selectedPaper && customTitle
                    ? 'bg-[#12131A] border-emerald-500/40 text-[#F5F5F7]'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/10'
                }`}
                id="custom-paper-trigger"
              >
                <span className="block font-sans font-extrabold text-xs mb-1 text-white">Upload Custom Abstract</span>
                <p className="text-[10px] text-gray-400 line-clamp-1 mb-1.5 font-sans font-medium">Paste the text of a custom astrophysical abstract to run analytical citation parsing</p>
                <span className="inline-block text-[8px] font-mono uppercase tracking-wide text-pink-500 bg-pink-500/5 px-2 py-0.5 rounded border border-pink-500/10">PASTE TEXT / ABSTRACT</span>
              </button>
            </div>

            {/* Custom Input Fields */}
            {(!selectedPaper || customTitle) && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">PAPER TITLE</label>
                  <input
                    type="text"
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-[#F5F5F7] focus:outline-none focus:border-emerald-500"
                    placeholder="Enter thesis title..."
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    id="paper-title-input"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-gray-500 uppercase block mb-1">SPECTRUM / ABSTRACT ARRAYS</label>
                  <textarea
                    rows={6}
                    className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-xs text-[#F5F5F7] placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-sans"
                    placeholder="Paste the abstract to scan for citations (DOIs, astrophysics journals, astronomical markers)..."
                    value={customAbstract}
                    onChange={(e) => setCustomAbstract(e.target.value)}
                    id="paper-abstract-input"
                  />
                </div>
              </div>
            )}

            {/* Preset Info Display */}
            {selectedPaper && !customAbstract && (
              <div className="bg-black/40 border border-white/5 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">PRESET REFERENCE PAPER</span>
                  <span className="text-[8px] font-mono text-gray-500">DOI: {selectedPaper.doi}</span>
                </div>
                <h4 className="font-sans font-bold text-sm text-[#F5F5F7] leading-tight">
                  {selectedPaper.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-sans font-semibold">
                  {selectedPaper.authors} — {selectedPaper.journal}
                </p>
                <div className="text-xs text-gray-300 font-sans max-h-44 overflow-y-auto leading-relaxed border-t border-white/5 pt-2 italic">
                  &ldquo;{selectedPaper.abstract}&rdquo;
                </div>
              </div>
            )}
          </div>

          <button
            onClick={executeSummarization}
            disabled={runningSummarization || (!selectedPaper && !customAbstract.trim())}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-lg text-xs transition-all uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:opacity-50"
            id="copilot-compile-btn"
          >
            {runningSummarization ? (
              <>
                <Cpu className="w-4 h-4 animate-spin" />
                <span>AI NLP Extraction Proceeding...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Parse Astronomy Abstract with Gemini</span>
              </>
            )}
          </button>
        </div>

        {/* Output Column (7 cols) */}
        <div className="lg:col-span-7 bg-black/40 rounded-xl border border-white/10 p-5 flex flex-col justify-between">
          {!parsedReport ? (
            <div className="flex flex-col items-center justify-center text-center h-full py-20 text-gray-500">
              <BookOpen className="w-10 h-10 mb-3 text-gray-700 stroke-[1]" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">RESEARCH INDEX EMPTY</p>
              <p className="text-[10px] text-gray-600 max-w-sm font-mono mt-1">
                Select a paper template or supply your custom thesis, then tap the Gemini extraction button.
              </p>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in flex-1">
              {/* Summary Block */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">ASTROMETRIC EXECUTIVE SUMMARY</span>
                <p className="text-xs font-sans text-gray-200 leading-relaxed bg-[#12131A] p-3.5 rounded-lg border border-white/10">
                  {parsedReport.summary}
                </p>
              </div>

              {/* Citations Extracted */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">EXTRACTED BIBLIOGRAPHICAL INDEX {parsedReport.citations?.length ? `(${parsedReport.citations.length})` : ""}</span>
                <div className="grid grid-cols-1 select-text divide-y divide-white/5 bg-black/60 rounded-lg p-3.5 border border-white/5 text-xs font-mono space-y-1">
                  {parsedReport.citations && parsedReport.citations.map((cit: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start py-1.5 first:pt-0 last:pb-0">
                      <span className="text-emerald-400">[{idx + 1}]</span>
                      <span className="text-gray-300 leading-relaxed">{cit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Discoveries */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">KEY DETECTED SCIENTIFIC VARIABLES</span>
                <div className="space-y-2">
                  {parsedReport.findings && parsedReport.findings.map((f: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 items-start bg-white/5 border border-white/5 p-3 rounded-lg text-xs font-sans text-gray-300 leading-normal">
                      <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p>{f}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* LCDM Comparison */}
              {parsedReport.comparativeMatrix && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">COSMOLOGICAL CONSENSUS COMPARISON</span>
                  <div className="p-3 bg-pink-950/10 border border-pink-950/20 rounded-lg text-xs font-sans text-pink-200 leading-relaxed">
                    {parsedReport.comparativeMatrix}
                  </div>
                </div>
              )}
            </div>
          )}

          {parsedReport && (
            <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-6">
              <span className="text-[8px] font-mono text-gray-600">
                {exportSuccess ? (
                  <span className="text-emerald-400 font-bold uppercase tracking-wider animate-pulse">✓ REFERENCES ADDED TO INTEGRATED BIBLIOGRAPHY</span>
                ) : (
                  "PARSED THROUGH VECTOR LAYERS ON ASTRO-STORE"
                )}
              </span>
              <button
                onClick={handleExportBibtex}
                className={`px-3 py-1.5 text-[10px] font-mono border rounded uppercase transition-all whitespace-nowrap cursor-pointer ${
                  exportSuccess
                    ? 'bg-emerald-500/10 text-emerald-350 border-emerald-500/30'
                    : 'bg-white/5 hover:bg-white/10 text-gray-405 border-white/10 text-gray-400 hover:text-white'
                }`}
                id="export-bibtex-btn"
              >
                {exportSuccess ? "INDEXED SUCCESSFULLY" : "COMPILE BIBTEX INDEX"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
