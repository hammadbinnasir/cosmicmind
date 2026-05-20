"use client";

import React, { useState, useEffect } from 'react';
import { 
  GALAXIES, 
  Galaxy, 
  COSMIC_EVENTS 
} from '@/lib/mockData';
import { 
  Globe, 
  Compass, 
  Cpu, 
  Terminal, 
  BookOpen, 
  Sliders, 
  Sun, 
  Layers, 
  Satellite, 
  ChevronRight, 
  Activity, 
  AlertOctagon, 
  Award, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

// Custom component imports
import GalaxyMap from '@/components/GalaxyMap';
import GalaxyAnalyzer from '@/components/GalaxyAnalyzer';
import CosmicChat from '@/components/CosmicChat';
import Copilot from '@/components/Copilot';
import EventDashboard from '@/components/EventDashboard';
import SimulationSandbox from '@/components/SimulationSandbox';
import ArchitectureViewer from '@/components/ArchitectureViewer';
import DiscoveryEngine from '@/components/DiscoveryEngine';
import ObservatoryConsole from '@/components/ObservatoryConsole';
import AgiCivilization from '@/components/AgiCivilization';

type ActiveView = 'civilization' | 'explorer' | 'analyzer' | 'chat' | 'papers' | 'transits' | 'simulator' | 'blueprints' | 'discovery' | 'network';

export default function Page() {
  const [platformActivated, setPlatformActivated] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>('civilization');
  const [selectedGalaxy, setSelectedGalaxy] = useState<Galaxy | null>(GALAXIES[1]);

  // Global counter metrics
  const [moneySaved, setMoneySaved] = useState<number>(104250000); // represents "Telescope Computational Cost Saved"
  const [anomaliesTracked, setAnomaliesTracked] = useState<number>(342);
  const [spectraIndexed, setSpectraIndexed] = useState<number>(4582910);
  const [activeObservers, setActiveObservers] = useState<number>(128);

  const [landingLogs, setLandingLogs] = useState<string[]>([
    "L3 PORTAL LINK COMPLETE - 0% PKT DROPS RETRIEVED",
    "ESTABLISHING TELESCOPE CORRELATION SCHEMES ON 2.7K CMB BACKGROUND",
    "HUBBLE CO-ADD MATRICES CO-ALIGNING TARGETING CO-ORDINATES M87*"
  ]);

  // Coordinates targeter state passed across components (coordinate warp linkage)
  const [lockedRa, setLockedRa] = useState<string>("");
  const [lockedDec, setLockedDec] = useState<string>("");

  // Ticker up metrics & change logs dynamically
  useEffect(() => {
    const logPool = [
      "MOR-74 relativistic accretion wave modulated successfully",
      "Sloan Digital Sky Survey (SDSS) coordinates mapped to vector layer",
      "LIGO S240214a transient alert dispatched - anomaly probability 98%",
      "SIMBAD stellar database resolving redshift parameter z=0.145",
      "JWST NIRSpec ingress pipeline initialized with 0% token drift",
      "HNSW vector matches complete - correlation exceeds 91% confidence",
      "Primary task route assigned to Gemini Flash-3.5 API link",
      "Keplerian orbital coordinates compiled with accuracy delta < 1e-9",
      "Astrometric catalog cross-referenced against ESA Gaia parameters",
      "James Webb Space Telescope multi-spectral co-add alignment verified"
    ];

    const interval = setInterval(() => {
      // Metrics
      setMoneySaved(prev => prev + Math.floor(Math.random() * 450 + 100));
      setSpectraIndexed(prev => prev + Math.floor(Math.random() * 4 + 1));
      setAnomaliesTracked(prev => {
        if (Math.random() > 0.8) return prev + 1;
        return prev;
      });
      setActiveObservers(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const newObservers = prev + delta;
        return newObservers > 100 ? newObservers : 100;
      });

      // Appending new logs
      setLandingLogs(prev => {
        const newLog = logPool[Math.floor(Math.random() * logPool.length)];
        return [newLog, prev[0], prev[1]].slice(0, 3);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Transits alert locking linkage
  const handleTransitCoordinateLock = (ra: string, dec: string) => {
    setLockedRa(ra);
    setLockedDec(dec);
    setActiveView('explorer');

    // Create a virtual specimen for the warp coordinates target
    const warpSpecimen: Galaxy = {
      id: `fl-evt-${Date.now()}`,
      name: "Transient GRB Event Source",
      type: "Unknown Anomaly",
      constellation: "Interstellar Horizon Field",
      distance: "8,900 Mly",
      ra: ra,
      dec: dec,
      redshift: 6.84,
      anomalyScore: 92,
      status: "Critical Anomaly",
      spectralData: [45, 90, 180, 240, 480, 890, 1020, 920, 780, 410, 230],
      description: `Target locked via coordinate telemetry warp. Continuous radio telemetry indicates active relativistic magnetic collapses colliding at cosmological distance z=6.84.`,
      color: "#ec4899",
      coordinates: { x: 90, y: 70, z: 120 }
    };
    setSelectedGalaxy(warpSpecimen);
  };

  // Ingest completed callback
  const handleAnalysisComplete = (newGalaxy: Galaxy, aiReport: any) => {
    setSelectedGalaxy(newGalaxy);
    setAnomaliesTracked(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-[#050508] relative font-sans text-slate-300 overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-400">
      
      {/* 1. CINEMATIC LANDING SCREEN */}
      {!platformActivated ? (
        <div className="relative min-h-screen flex flex-col justify-between items-center px-4 py-8 overflow-hidden" id="landing-page-viewport">
          {/* Neon Space Background Canvas Gradient Blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Grid background map pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Floating Bento Header Panel */}
          <header className="w-full max-w-7xl flex justify-between items-center z-10 bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 backdrop-blur-md shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 animate-pulse"></div>
              <h1 className="text-sm font-bold tracking-tighter text-white uppercase italic">CosmicMind</h1>
            </div>
            <div className="flex items-center gap-6 text-[9px] font-mono tracking-wider uppercase opacity-70">
              <span className="hidden md:inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> L3 Lagrange Point</span>
              <span className="hidden sm:inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Neural Link Active</span>
              <span className="text-white hidden xs:inline">UTC 14:22:09</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-0.5 bg-white/10 rounded-full text-[9px] text-white border border-white/20">ID: ASTR-90221</span>
            </div>
          </header>

          {/* Core Banner hero text */}
          <div className="max-w-6xl w-full text-center space-y-8 z-10 my-auto text-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-gray-400 tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>COSMICMIND AI NEURAL LINK PIPELINE SECURED</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight text-white leading-none uppercase">
                COSMICMIND <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">AI</span>
              </h1>
              <p className="font-sans text-xs sm:text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed select-none uppercase tracking-wider">
                Autonomous multi-spectral FITS ingestion, intelligent neural target classification & real-time cosmic event prediction pipelines. Approved for L3 orbit instrumentation sweeps.
              </p>
            </div>

            {/* Scientific Live Counters Grid (SpaceX styled) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto border-y border-white/10 py-6 my-6">
              <div className="text-center font-mono p-3 bg-white/5 border border-white/5 rounded-2xl">
                <span className="block text-[8px] text-gray-500 uppercase tracking-widest">GALAXIES OBSERVABLE:</span>
                <span className="text-xl font-extrabold text-[#F5F5F7] mt-1 block">10,000+</span>
              </div>
              <div className="text-center font-mono p-3 bg-white/5 border border-white/5 rounded-2xl">
                <span className="block text-[8px] text-gray-500 uppercase tracking-widest">SPECTRA_INDEXED:</span>
                <span className="text-xl font-extrabold text-cyan-400 mt-1 block tracking-tight">
                  {spectraIndexed.toLocaleString()}
                </span>
              </div>
              <div className="text-center font-mono p-3 bg-white/5 border border-white/5 rounded-2xl">
                <span className="block text-[8px] text-gray-500 uppercase tracking-widest">ANOMALIES_MAPPED:</span>
                <span className="text-xl font-extrabold text-pink-400 mt-1 block">{anomaliesTracked}</span>
              </div>
              <div className="text-center font-mono p-3 bg-white/5 border border-white/5 rounded-2xl">
                <span className="block text-[8px] text-gray-500 uppercase tracking-widest">ACTIVE_STATIONS:</span>
                <span className="text-xl font-extrabold text-emerald-400 mt-1 block">{activeObservers}</span>
              </div>
            </div>

            {/* Dynamic System Activity Feed Panel (NASA live diagnostic feed) */}
            <div className="max-w-2xl mx-auto bg-black/85 border border-white/10 rounded-2xl p-4 space-y-1.5 text-left font-mono text-[9px]">
              <div className="flex justify-between items-center text-gray-500 uppercase text-[8px] border-b border-white/5 pb-1.5 mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>DEEP SPACE TELEMETRY LIVE INGESTION INBOUND LINK</span>
                </span>
                <span>STATE: STEADY</span>
              </div>
              {landingLogs.map((log, index) => (
                <div key={index} className={`flex items-start gap-2 text-gray-400 truncate transition-all duration-300 ${index === 0 ? 'text-emerald-400' : 'opacity-60'}`}>
                  <span className="text-gray-600 shrink-0" suppressHydrationWarning>[{new Date().toLocaleTimeString()}]</span>
                  <span className="font-semibold shrink-0 uppercase">CORE_{index + 1}:</span>
                  <p className="truncate select-none">{log}</p>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setPlatformActivated(true)}
                className="px-10 py-4 bg-emerald-500 text-black font-semibold rounded-full text-xs tracking-widest uppercase hover:bg-emerald-400 transition-all cursor-pointer shadow-xl hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center gap-3 mx-auto group active:scale-95 duration-150"
                id="activate-platform-cta"
              >
                <span>ENTER THE INTELLIGENCE CORE</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Micro Cards Features Overview */}
          <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 z-10 pt-8 border-t border-white/10">
            {[
              {
                title: "Galaxy Analyzer",
                desc: "Multi-spectral FITS image ingest with regional thermal anomaly mapping.",
                icon: Cpu,
                tag: "FITS ANALYSIS PIPELINE",
                view: "analyzer" as const,
                color: "from-emerald-500/10 to-teal-500/5 text-emerald-400 border-emerald-500/15 hover:border-emerald-400/40 hover:shadow-[0_0_20px_rgba(52,211,153,0.1)] hover:from-emerald-500/5 hover:to-emerald-500/10"
              },
              {
                title: "Cosmic Chat",
                desc: "Scientific reasoning chatbot specializing in complex orbital physics formulas.",
                icon: Terminal,
                tag: "COGNITIVE COPROCESSOR",
                view: "chat" as const,
                color: "from-cyan-500/10 to-blue-500/5 text-cyan-400 border-cyan-500/15 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:from-cyan-500/5 hover:to-cyan-500/10"
              },
              {
                title: "Research Copilot",
                desc: "Extract academic bibliographies and map lambda-CDM model deviations.",
                icon: BookOpen,
                tag: "BIBLIOGRAPHIC ORACLE",
                view: "papers" as const,
                color: "from-indigo-500/10 to-violet-500/5 text-indigo-400 border-indigo-500/15 hover:border-indigo-400/40 hover:shadow-[0_0_20px_rgba(129,140,248,0.1)] hover:from-indigo-500/5 hover:to-indigo-500/10"
              },
              {
                title: "Transient Alerts",
                desc: "Real-time supernovae alarms, FRB tickers, and coordinate auto-locks.",
                icon: Satellite,
                tag: "REALTIME TELEMETRY",
                view: "transits" as const,
                color: "from-pink-500/10 to-rose-500/5 text-pink-400 border-pink-500/15 hover:border-pink-400/40 hover:shadow-[0_0_20px_rgba(244,114,182,0.1)] hover:from-pink-500/5 hover:to-pink-500/10"
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveView(card.view);
                    setPlatformActivated(true);
                  }}
                  className={`group relative text-left bg-gradient-to-b border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer backdrop-blur-sm ${card.color}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[8.5px] font-bold tracking-widest uppercase opacity-60">
                      {card.tag}
                    </span>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <h4 className="font-sans font-extrabold text-sm text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 transition-all duration-300">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed group-hover:text-slate-350 transition-colors">
                    {card.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <footer className="w-full max-w-7xl flex justify-between items-center text-[9px] font-mono text-gray-600 mt-8 pt-4 border-t border-white/10">
            <span>PLATFORM INTEGRATION SECURED</span>
            <span>LICENSED FOR PUBLIC CELESTIAL ADVANCEMENT APPARATUS</span>
          </footer>
        </div>
      ) : (

        // 2. DYNAMIC WORKSPACE DASHBOARD
        <div className="min-h-screen flex flex-col bg-[#050508] p-4 sm:p-6 space-y-4" id="platform-dashboard-workspace">
          
          {/* Floating Bento Header */}
          <header className="z-20 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-md shadow-2xl shrink-0">
            {/* Logo anchor */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setPlatformActivated(false)}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-600 animate-pulse"></div>
              <div>
                <h1 className="text-xl font-bold tracking-tighter text-white uppercase italic">CosmicMind</h1>
                <p className="text-[8px] font-mono text-slate-400 uppercase tracking-widest">Autonomous Observatory Intelligence Pipeline</p>
              </div>
            </div>

            {/* Middle Status Line */}
            <div className="hidden lg:flex items-center space-x-6 text-[10px] font-mono tracking-widest uppercase opacity-70">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> L3 Lagrange Point</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Neural Link Active</div>
              <div className="text-white">UTC 14:22:09</div>
            </div>

            {/* Ingest statistics panel ticker */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                <span className="text-slate-500 block text-[9px]">COMPUTATIONAL SAVINGS</span>
                <span className="text-cyan-400 font-bold block" id="money-saved-counter">
                  ${moneySaved.toLocaleString()}
                </span>
              </div>
              <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl">
                <span className="text-slate-500 block text-[9px]">ANOMALIES RESPONDED</span>
                <span className="text-pink-400 font-extrabold block">
                  {anomaliesTracked} TARGETS
                </span>
              </div>
              <div className="hidden xs:block bg-black/40 border border-white/10 px-3 py-1.5 rounded-xl text-white font-bold">
                <span className="text-slate-500 block text-[9px]">ID TAG</span>
                <span className="block text-[10px] text-zinc-300">ASTR-90221</span>
              </div>
            </div>
          </header>

          {/* Primary Sidebar and Sub-views layout */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0" id="workspace-layout-container">
            
            {/* Nav sidebar triggers */}
            <nav className="w-full md:w-64 bg-white/5 border border-white/10 rounded-3xl p-4 md:p-5 flex flex-col justify-between backdrop-blur-sm shadow-2xl shrink-0 gap-4 md:gap-6 overflow-hidden">
              <div className="space-y-3 md:space-y-4">
                <span className="text-[10px] font-mono text-zinc-400 uppercase hidden md:block font-bold tracking-widest pl-2">Observatory Command</span>

                <div className="flex flex-row md:flex-col gap-2 overflow-x-auto scrollbar-none pb-2 md:pb-0 w-full">
                  {[
                    { id: 'civilization', label: 'AGI Machine Scientist', icon: Cpu, alert: true },
                    { id: 'discovery', label: 'Autonomous Discovery', icon: Sparkles, alert: true },
                    { id: 'network', label: 'Observatory Network', icon: Globe, alert: true },
                    { id: 'explorer', label: 'Space Explorer', icon: Compass, alert: false },
                    { id: 'analyzer', label: 'AI Galaxy Analyzer', icon: Cpu, alert: false },
                    { id: 'chat', label: 'Cosmic Assistant', icon: Terminal, alert: false },
                    { id: 'papers', label: 'Research Copilot', icon: BookOpen, alert: false },
                    { id: 'transits', label: 'Transient Monitor', icon: Satellite, alert: true },
                    { id: 'simulator', label: 'Physical Sandbox', icon: Sliders, alert: false },
                    ...(process.env.NODE_ENV === 'development' ? [
                      { id: 'blueprints', label: 'Developer Blueprints', icon: Layers, alert: false }
                    ] : [])
                  ].map(item => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as any)}
                        className={`flex items-center justify-between p-3 rounded-2xl text-xs font-sans transition-all cursor-pointer border shrink-0 gap-3 md:w-full whitespace-nowrap ${
                          isActive 
                            ? 'bg-white/10 text-cyan-450 font-bold border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                            : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5'
                        }`}
                        id={`nav-link-${item.id}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.alert && (
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-pink-500 animate-ping'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Connected credentials warning banner */}
              <div className="hidden md:block space-y-3">
                <div className="bg-black/40 rounded-2xl border border-white/10 p-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="font-mono text-[9px] text-white font-bold tracking-wider">NEURAL CORE</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal normal-case">
                    Google GenAI integrated on server via <span className="text-cyan-400 font-mono">gemini-3.5-flash</span>. Settings configured.
                  </p>
                </div>
              </div>
            </nav>

            {/* Central component container display (Glass Bento Panel) */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-2xl overflow-y-auto relative min-h-0">
              {activeView === 'civilization' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-civilization">
                  <AgiCivilization />
                </div>
              )}

              {activeView === 'network' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-network">
                  <ObservatoryConsole />
                </div>
              )}

              {activeView === 'discovery' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-discovery">
                  <DiscoveryEngine />
                </div>
              )}

              {activeView === 'explorer' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-explorer">
                  <GalaxyMap 
                    selectedGalaxy={selectedGalaxy}
                    onSelectGalaxy={setSelectedGalaxy} 
                  />
                </div>
              )}

              {activeView === 'analyzer' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-analyzer">
                  <GalaxyAnalyzer onAnalyzingComplete={handleAnalysisComplete} />
                </div>
              )}

              {activeView === 'chat' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-chat">
                  <CosmicChat />
                </div>
              )}

              {activeView === 'papers' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-papers">
                  <Copilot />
                </div>
              )}

              {activeView === 'transits' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-transits">
                  <EventDashboard onCoordinateLock={handleTransitCoordinateLock} />
                </div>
              )}

              {activeView === 'simulator' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-simulator">
                  <SimulationSandbox />
                </div>
              )}

              {activeView === 'blueprints' && process.env.NODE_ENV === 'development' && (
                <div className="h-full space-y-4 animate-fade-in" id="viewport-blueprints">
                  <ArchitectureViewer />
                </div>
              )}
            </div>

          </div>

          {/* Connected Satellite Global Footer bar */}
          <footer className="h-10 flex items-center justify-between px-2 text-[9px] font-mono uppercase tracking-[0.2em] opacity-40 shrink-0">
            <div className="flex space-x-12">
              <span>RA: 14h 03m 12.6s</span>
              <span>DEC +54° 20′ 57″</span>
              <span>ORBIT: LEO-34A-GRID</span>
            </div>
            <div className="flex space-x-6">
              <span className="text-cyan-400">STATUS: MATCHED CO-ADDS INSTALLED</span>
              <span>MISSION CLOCK 412:12:09</span>
            </div>
          </footer>

        </div>
      )}
    </main>
  );
}
