"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  RecursiveReasoningEngine, 
  ScientificGap, 
  FailedTheory, 
  BeliefState, 
  HypothesisLineage, 
  UniverseNode, 
  DebateSession, 
  RecursiveReasoningTrace 
} from '@/lib/agents/RecursiveReasoningEngine';
import { 
  Cpu, 
  Activity, 
  Network, 
  GitBranch, 
  Flame, 
  Search, 
  Users, 
  Scale, 
  Sliders, 
  AlertTriangle, 
  Compass, 
  ShieldAlert, 
  Check, 
  TrendingUp, 
  RefreshCw, 
  Radio, 
  Send,
  Workflow
} from 'lucide-react';

export default function AgiCivilization() {
  const engine = RecursiveReasoningEngine.getInstance();

  // State arrays from the engine
  const [beliefStates, setBeliefStates] = useState<BeliefState[]>(() => engine.getBeliefStates());
  const [failedTheories, setFailedTheories] = useState<FailedTheory[]>(() => engine.getFailedTheories());
  const [scientificGaps, setScientificGaps] = useState<ScientificGap[]>(() => engine.getScientificGaps());
  const [lineages, setLineages] = useState<HypothesisLineage[]>(() => engine.getHypothesisLineages());
  const [universeGraph, setUniverseGraph] = useState<UniverseNode[]>(() => engine.getUniverseGraph());
  const [debateSessions, setDebateSessions] = useState<DebateSession[]>(() => engine.getDebateSessions());
  const [traces, setTraces] = useState<RecursiveReasoningTrace[]>(() => engine.getReasoningTraces());

  // Interactive UI Inputs
  const [targetName, setTargetName] = useState<string>("Coma-B12 Synchrotron Source");
  const [raCoord, setRaCoord] = useState<string>("12h 59m 35.4s");
  const [decCoord, setDecCoord] = useState<string>("+27° 58′ 12″");
  const [anomalyScore, setAnomalyScore] = useState<number>(88);
  const [agiMode, setAgiMode] = useState<'speculative' | 'empirical' | 'quantum'>('speculative');
  const [isExecutingCycle, setIsExecutingCycle] = useState<boolean>(false);
  const [statusLog, setStatusLog] = useState<string[]>([
    "AGI Civilization Core initialized. Model: gemini-3.5-flash",
    "Continuous cosmic opportunity map scanner: ACTIVE.",
    "L3 Lagrange belief synchronization: COMPLETE."
  ]);

  // ESV Weights
  const [weightImportance, setWeightImportance] = useState<number>(85);
  const [weightUncertainty, setWeightUncertainty] = useState<number>(75);
  const [weightGain, setWeightGain] = useState<number>(90);
  const [weightFeasibility, setWeightFeasibility] = useState<number>(65);

  const calculatedESV = engine.calculateESV({
    importance: weightImportance,
    uncertainty: weightUncertainty,
    informationGain: weightGain,
    feasibility: weightFeasibility
  });

  const [activeCycleResult, setActiveCycleResult] = useState<any>(null);

  // Triggering the Autonomous Discovery Loop
  const handleRunDiscoveryCycle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetName.trim()) return;

    setIsExecutingCycle(true);
    const newLog = `[${new Date().toLocaleTimeString()}] Initializing Recursive Discovery Loop targeting ${targetName}...`;
    setStatusLog(prev => [newLog, ...prev]);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    await delay(800);
    setStatusLog(prev => [`[${new Date().toLocaleTimeString()}] Calculating Expected Scientific Value (ESV: ${calculatedESV}/100)...`, ...prev]);
    
    await delay(800);
    setStatusLog(prev => [`[${new Date().toLocaleTimeString()}] Scanning Scientific Gaps Database & coordinates line-of-sight...`, ...prev]);

    await delay(1000);
    setStatusLog(prev => [`[${new Date().toLocaleTimeString()}] Simulating Multi-Agent Debate Arena (Theorist vs Skeptic vs Verifier)...`, ...prev]);

    await delay(1000);
    setStatusLog(prev => [`[${new Date().toLocaleTimeString()}] Running Self-Improving Reasoning Engine (Reflection & Contradiction Resolution)...`, ...prev]);

    // Executing the cycle in the engine
    const result = await engine.executeDiscoveryCycle(
      targetName,
      { ra: raCoord, dec: decCoord },
      anomalyScore,
      {
        importance: weightImportance,
        uncertainty: weightUncertainty,
        infoGain: weightGain,
        feasibility: weightFeasibility
      }
    );

    await delay(800);
    // Refresh states from engine
    setBeliefStates([...engine.getBeliefStates()]);
    setFailedTheories([...engine.getFailedTheories()]);
    setScientificGaps([...engine.getScientificGaps()]);
    setLineages([...engine.getHypothesisLineages()]);
    setUniverseGraph([...engine.getUniverseGraph()]);
    setDebateSessions([...engine.getDebateSessions()]);
    setTraces([...engine.getReasoningTraces()]);

    setActiveCycleResult(result);
    setIsExecutingCycle(false);
    setStatusLog(prev => [
      `[✓ SUCCESS] Loop completed. Category: ${result.theoryCategory.toUpperCase()}. Confidence: ${result.trace.revisedConfidence}%. Gaps mapped!`,
      ...prev
    ]);
  };

  // Populate fields when clicking on a gap
  const handleSelectGap = (gap: ScientificGap) => {
    setTargetName(`Gap target ${gap.name}`);
    setRaCoord(gap.coordinates.ra);
    setDecCoord(gap.coordinates.dec);
    setAnomalyScore(Math.round(gap.underExploredIndex * 0.95));
    const addLog = `[🛰️ NAVIGATION] Target coordinates locked from Opportunity Map: RA ${gap.coordinates.ra}, Dec ${gap.coordinates.dec}`;
    setStatusLog(prev => [addLog, ...prev]);
  };

  // Dispatch observatory swarms simulation
  const handleDispatchObservatories = (swarmType: string) => {
    const timeStr = new Date().toLocaleTimeString();
    setStatusLog(prev => [
      `[${timeStr}] Dispatching autonomous task packet to ${swarmType} array...`,
      `[${timeStr}] [${swarmType}] Slew locks computed. Pointing shutters. Epoch exposure set to 15,000s.`,
      ...prev
    ]);
  };

  // Auto-run first cycle to show some visual output if none exists
  useEffect(() => {
    if (debateSessions.length === 0) {
      const timer = setTimeout(() => {
        handleRunDiscoveryCycle();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 text-[#A0AEC0]" id="agi-civilization-simulation-root">
      
      {/* HEADER BANNER */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-[#0D0E15] border border-cyan-550/20 border-cyan-500/10 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
        {/* Glowing background accent */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-full font-mono text-[9px] font-extrabold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>COGNITION CIVILIZATION LAYER ACTIVE</span>
            </span>
          </div>
          <h2 className="font-sans font-extrabold text-white text-2xl tracking-tight uppercase">AGI Machine Scientist Civilization</h2>
          <p className="font-mono text-[10px] text-zinc-400 tracking-wider">RECURSION ENGINE • AUTONOMOUS THEORY LABS • KNOWLEDGE GENEALOGY • UNIVERSE SCALING</p>
        </div>

        {/* Dynamic Mode Switcher */}
        <div className="flex gap-2 bg-black/40 border border-white/10 p-1.5 rounded-2xl">
          {[
            { id: 'speculative', label: 'Speculative Synthesis', color: 'text-purple-400' },
            { id: 'empirical', label: 'Rigorous Verification', color: 'text-emerald-400' },
            { id: 'quantum', label: 'Quantum Divergence', color: 'text-cyan-400' }
          ].map(m => (
            <button
              key={m.id}
              onClick={() => {
                setAgiMode(m.id as any);
                setStatusLog(prev => [`[⚙️ MODE] Switched AGI Cognition to ${m.label.toUpperCase()}`, ...prev]);
              }}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                agiMode === m.id 
                  ? 'bg-white/10 text-white font-bold border border-white/10' 
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              <span className={agiMode === m.id ? m.color : ""}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: CIVILIZATION CONSOLE & EXPECTED SCIENTIFIC VALUE (SPAN 5) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* CONTROL CONSOLE */}
          <div className="bg-[#090A10] border border-white/5 p-5 rounded-3xl space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. CYCLE CONTROL CONSOLE</span>
              </span>
              <span className="text-[8px] font-mono text-cyan-400 animate-pulse uppercase">COGNITIVE_READY</span>
            </div>

            <form onSubmit={handleRunDiscoveryCycle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-mono text-gray-500 uppercase mb-1">Target Name</label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-cyan-550 focus:border-cyan-500 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-gray-500 uppercase mb-1">Anomaly Ingest Score</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={anomalyScore}
                      onChange={(e) => setAnomalyScore(Number(e.target.value))}
                      className="flex-1 bg-white/10 h-1 rounded accent-cyan-400 cursor-pointer"
                    />
                    <span className="bg-black/60 border border-white/10 font-mono text-[11px] text-white px-2 py-1 rounded-lg shrink-0">{anomalyScore}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[8px] font-mono text-gray-500 uppercase mb-1">Right Ascension (RA)</label>
                  <input
                    type="text"
                    value={raCoord}
                    onChange={(e) => setRaCoord(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[8px] font-mono text-gray-500 uppercase mb-1">Declination (Dec)</label>
                  <input
                    type="text"
                    value={decCoord}
                    onChange={(e) => setDecCoord(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* Expected Scientific Value (ESV) Sliders */}
              <div className="bg-black/40 border border-white/5 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-1.5 mb-1.5">
                  <span className="block text-[8.5px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Expected Scientific Value (ESV) Parameters</span>
                  <span className="text-[10px] font-mono font-bold text-pink-400 bg-pink-500/5 px-2 py-0.5 border border-pink-500/10 rounded">ESV: {calculatedESV}%</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[9px] font-mono">
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-500">
                      <span>IMPORTANCE:</span>
                      <span className="text-white font-bold">{weightImportance}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={weightImportance}
                      onChange={(e) => setWeightImportance(Number(e.target.value))}
                      className="w-full h-0.5 bg-white/10 rounded accent-pink-500 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-500">
                      <span>UNCERTAINTY:</span>
                      <span className="text-white font-bold">{weightUncertainty}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={weightUncertainty}
                      onChange={(e) => setWeightUncertainty(Number(e.target.value))}
                      className="w-full h-0.5 bg-white/10 rounded accent-pink-500 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-500">
                      <span>INFO GAIN:</span>
                      <span className="text-white font-bold">{weightGain}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={weightGain}
                      onChange={(e) => setWeightGain(Number(e.target.value))}
                      className="w-full h-0.5 bg-white/10 rounded accent-pink-500 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-gray-500">
                      <span>FEASIBILITY:</span>
                      <span className="text-white font-bold">{weightFeasibility}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={weightFeasibility}
                      onChange={(e) => setWeightFeasibility(Number(e.target.value))}
                      className="w-full h-0.5 bg-white/10 rounded accent-pink-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isExecutingCycle}
                  className={`w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-semibold rounded-xl text-[10px] font-mono tracking-widest uppercase transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2 ${
                    isExecutingCycle ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isExecutingCycle ? "animate-spin text-black" : "text-black"}`} />
                  <span>{isExecutingCycle ? "EXECUTING COGNITION LOOP..." : "LAUNCH RECURSIVE DISCOVERY CYCLE"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* OBSERVATORY SWARMS DISPATCH */}
          <div className="bg-[#090A10] border border-white/5 p-5 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>2. CIVILIZATION OBSERVATORY DIRECTIVE</span>
              </span>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">SYS_ACT_ARRAYS</span>
            </div>

            <p className="text-[10px] leading-relaxed text-slate-400">
              Trigger instant coordinate pointing slews to robotic satellite constellations, space arrays, or deep probes directly to verify generated hypotheses.
            </p>

            <div className="grid grid-cols-3 gap-2 text-[9px] font-mono">
              {[
                { name: "JWST Swarm Array", target: "JWST_SWARM" },
                { name: "L3 Deep Sat Lattice", target: "L3_SATELLITES" },
                { name: "Robotic Probe Slews", target: "DEEP_PROBES" }
              ].map(w => (
                <button
                  key={w.target}
                  onClick={() => handleDispatchObservatories(w.name)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-center cursor-pointer transition-all hover:border-white/20 select-none text-white truncate"
                >
                  <span>{w.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC TELEMETRY LOGS FEED */}
          <div className="bg-black border border-white/10 p-5 rounded-3xl space-y-3 h-[250px] flex flex-col justify-between">
            <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 border-b border-white/10 pb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>CIVILIZATION DIAGNOSTIC STREAM</span>
              </span>
              <span>NODE_SYS: L3_LAGRANGE_CENTRAL</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[9px] text-[#A0AEC0] pr-1 leading-normal">
              {statusLog.map((log, index) => (
                <div key={index} className={index === 0 ? "text-cyan-400" : "opacity-60"}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: AGI COGNITION DEBATES, LANDSCAPES & TREES (SPAN 7) */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* BELIEF STATE & CONFIDENCE LANDSCAPE */}
          <div className="bg-[#090A10] border border-white/5 p-5 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-[#ec4899]" />
                <span>3. MACHINE BELIEFS & CONFIDENCE LANDSCAPES</span>
              </span>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">SYS_COSMO_VECTORS</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beliefStates.map((b, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <h5 className="text-white text-xs font-sans font-bold leading-tight">{b.cosmologyModel}</h5>
                    <span className="font-mono text-[9px] text-pink-400 bg-pink-500/5 px-2 py-0.5 border border-pink-500/10 rounded">{b.confidenceScore}%</span>
                  </div>

                  {/* Confidence timeline mini-sparkline */}
                  <div className="flex items-center gap-2 h-4">
                    <span className="text-[8px] font-mono text-gray-500 uppercase shrink-0">TRAJ:</span>
                    <div className="flex-1 flex gap-1 items-end h-full">
                      {b.history.map((val, vIdx) => (
                        <div 
                          key={vIdx} 
                          className="flex-1 bg-[#ec4899]/30 rounded-t" 
                          style={{ height: `${val}%`, minHeight: '2px' }} 
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-mono border-t border-white/5 pt-2">
                    <span className="text-gray-500">CONSENSUS</span>
                    <span className="text-zinc-300 font-bold">{b.consensusPercent}% AGREEMENT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MULTI-AGENT SCIENTIFIC SOCIETY DEBATE ARENA */}
          <div className="bg-[#090A10] border border-white/5 p-5 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>4. MULTI-AGENT SCIENTIFIC SOCIETY DEBATE ARENA</span>
              </span>
              <span className="text-[8px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 rounded uppercase">Debate Active</span>
            </div>

            {debateSessions.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-black/50 border border-white/5 p-3.5 rounded-2xl flex justify-between items-center text-xs">
                  <div>
                    <span className="block text-[8px] font-mono text-gray-500 uppercase">ACTIVE DEBATE TOPIC</span>
                    <p className="text-slate-350 font-bold font-sans mt-0.5">{debateSessions[0].topic}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-[8px] font-mono text-gray-500 uppercase">CONSENSUS STATE</span>
                    <span className={`text-[10px] font-mono font-bold uppercase ${
                      debateSessions[0].resolvedState === 'consensus_reached' ? 'text-emerald-400' : 'text-yellow-400'
                    }`}>
                      {debateSessions[0].resolvedState.replace('_', ' ')} ({debateSessions[0].overallConsensusConfidence}%)
                    </span>
                  </div>
                </div>

                {/* Debater chat messages list */}
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {debateSessions[0].messages.map((m, mIdx) => (
                    <div key={mIdx} className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-1 relative">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-extrabold text-white text-[11px]">{m.agentName}</span>
                          <span className={`text-[7px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            m.agentRole === 'theorist' ? 'bg-purple-500/10 text-purple-400' :
                            m.agentRole === 'skeptic' ? 'bg-orange-500/10 text-orange-400' :
                            'bg-cyan-500/10 text-cyan-400'
                          }`}>{m.agentRole}</span>
                        </div>
                        <span className={`font-mono text-[8px] border px-1.5 py-0.2 rounded uppercase ${
                          m.consensusVote === 'agree' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' :
                          m.consensusVote === 'disagree' ? 'bg-red-500/5 text-red-400 border-red-500/10' :
                          'bg-gray-500/5 text-gray-400 border-gray-500/10'
                        }`}>{m.consensusVote}</span>
                      </div>
                      <p className="text-[10px] text-zinc-350 leading-relaxed font-sans">{m.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-xs py-10">No active debates. Launch a discovery cycle to trigger debates.</p>
            )}
          </div>

          {/* RECURSIVE REASONING TREE */}
          <div className="bg-[#090A10] border border-white/5 p-5 rounded-3xl space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
                <span>5. RECURSIVE REASONING PATHS</span>
              </span>
              <span className="text-[8px] font-mono text-zinc-500 uppercase">SYS_RECURSION_LINKS</span>
            </div>

            {traces.length > 0 ? (
              <div className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                  
                  {/* Step 1: Initial Hypothesis */}
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-1 relative h-full">
                    <span className="text-[8px] font-mono text-purple-400 font-bold block">1. INITIAL HYPOTHESIS</span>
                    <p className="text-[9px] text-[#A0AEC0] line-clamp-4 leading-normal">{traces[0].initialHypothesis}</p>
                  </div>

                  <div className="text-center font-mono text-[10px] text-slate-500">→ critique →</div>

                  {/* Step 2: Self Critique */}
                  <div className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-1 relative h-full">
                    <span className="text-[8px] font-mono text-[#ec4899] font-bold block">2. SELF CRITIQUE</span>
                    <p className="text-[9px] text-[#A0AEC0] line-clamp-4 leading-normal">{traces[0].selfCritique}</p>
                  </div>

                  <div className="text-center font-mono text-[10px] text-slate-500">→ resolve →</div>

                  {/* Step 3: Resolved */}
                  <div className="bg-[#06241b] border border-emerald-500/20 p-3 rounded-2xl space-y-1 relative h-full">
                    <span className="text-[8px] font-mono text-emerald-400 font-bold block">3. REVISED THEORY</span>
                    <p className="text-[9px] text-white line-clamp-4 leading-normal font-semibold">{traces[0].revisedHypothesis}</p>
                    <span className="block text-[8px] font-mono text-emerald-400 mt-1">CONFIDENCE: {traces[0].revisedConfidence}%</span>
                  </div>

                </div>

                <div className="bg-black/50 border border-white/5 p-3 rounded-2xl grid grid-cols-2 gap-3 text-[10px] font-mono">
                  <div>
                    <span className="text-gray-500 block uppercase text-[8px]">Uncertainty Minimization Delta:</span>
                    <span className="text-emerald-400 font-bold">-{traces[0].uncertaintyMinimizationDelta}% uncertainty reduction</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block uppercase text-[8px]">Adaptive strategy:</span>
                    <span className="text-zinc-300">{traces[0].adaptiveStrategyUpdate}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-xs py-10">No recursive reasoning traces compiled yet.</p>
            )}
          </div>

        </div>

      </div>

      {/* BOTTOM GRID PANEL: OPPORTUNITY MAPS & KNOWLEDGE GRAPH Traversals */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pt-2">
        
        {/* SCIENTIFIC OPPORTUNITY MAP (SPAN 6) */}
        <div className="xl:col-span-6 bg-[#090A10] border border-white/5 p-5 rounded-3xl space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <span className="font-mono text-[10px] text-pink-400 font-bold uppercase tracking-widest block">6. SCIENTIFIC OPPORTUNITY MAP</span>
              <h4 className="font-sans font-extrabold text-[#F5F5F7] text-xs uppercase mt-0.5">Identified Gaps, Contradictions, and Underexplored Regions</h4>
            </div>
            <Radio className="w-4 h-4 text-pink-400 shrink-0 animate-pulse" />
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {scientificGaps.map((gap, gIdx) => (
              <div 
                key={gap.id}
                onClick={() => handleSelectGap(gap)}
                className="bg-white/5 border border-white/5 hover:border-pink-500/20 hover:bg-white/10 p-3 rounded-2xl cursor-pointer transition-all space-y-2 relative text-xs flex justify-between select-all"
              >
                <div className="space-y-1 min-w-0 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">{gap.id}</span>
                    <h5 className="font-sans font-extrabold text-white text-xs truncate">{gap.name}</h5>
                  </div>
                  <span className="block font-mono text-[8px] text-gray-500">RA: {gap.coordinates.ra} | Dec: {gap.coordinates.dec}</span>
                  <p className="text-[10px] text-slate-400 font-sans leading-normal truncate">{gap.unresolvedContradiction}</p>
                </div>

                <div className="text-right shrink-0 flex flex-col justify-between">
                  <span className="bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono text-[9px] px-2 py-0.5 rounded font-bold">ESV: {gap.esvScore}%</span>
                  <span className="block text-[8px] font-mono text-slate-500 mt-1 uppercase">Underexplored: {gap.underExploredIndex}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UNIVERSE-SCALE KNOWLEDGE GRAPH (SPAN 6) */}
        <div className="xl:col-span-6 bg-[#090A10] border border-white/5 p-5 rounded-3xl space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">7. UNIVERSE-SCALE KNOWLEDGE GRAPH</span>
              <h4 className="font-sans font-extrabold text-[#F5F5F7] text-xs uppercase mt-0.5">Causal, Temporal, and Ancestry Lineages</h4>
            </div>
            <Network className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {universeGraph.map(n => (
                <div 
                  key={n.id}
                  className="p-3 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl space-y-1 relative text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-mono text-gray-500 uppercase block tracking-wider">{n.type}</span>
                      <h5 className="font-sans font-bold text-white leading-tight">{n.label}</h5>
                    </div>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-bold">SCORE: {n.anomalyScore}</span>
                  </div>

                  <p className="block font-mono text-[8px] text-gray-500 mt-1">COORD: {n.coordinates.ra}, {n.coordinates.dec}</p>
                </div>
              ))}
            </div>

            {/* Ancestry & Causal Trace Panel */}
            <div className="bg-black/60 border border-white/5 p-4 rounded-2xl space-y-3 flex flex-col justify-between">
              <div>
                <span className="block text-[8px] font-mono text-emerald-400 uppercase tracking-widest font-extrabold border-b border-white/10 pb-1.5 mb-2.5">Discovery Genealogy & Causal edge</span>
                
                {universeGraph.length > 0 ? (
                  <div className="space-y-2 text-[10px] leading-relaxed select-all">
                    <div>
                      <span className="text-gray-500 uppercase font-mono block">Node Reference:</span>
                      <span className="text-white font-bold font-sans">{universeGraph[0].label}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase font-mono block">Lineage parent ID:</span>
                      <span className="text-zinc-300 font-bold">{universeGraph[0].lineageParentId || "None (Root node)"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase font-mono block">Causal outflow connects:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {universeGraph[0].causalOutflowConnections.length > 0 ? (
                          universeGraph[0].causalOutflowConnections.map(cId => (
                            <span key={cId} className="text-[8px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">{cId}</span>
                          ))
                        ) : (
                          <span className="text-gray-600 italic">None (Outflow terminal)</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase font-mono block">Temporal predecessors:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {universeGraph[0].temporalPredecessors.length > 0 ? (
                          universeGraph[0].temporalPredecessors.map(pId => (
                            <span key={pId} className="text-[8px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">{pId}</span>
                          ))
                        ) : (
                          <span className="text-gray-600 italic">None (Initial epoch)</span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center font-mono text-gray-500">No nodes in the universe graph.</p>
                )}
              </div>

              {/* FAILED THEORY ARCHIVES ARCHIVE */}
              <div className="border-t border-white/10 pt-2.5 mt-2.5">
                <span className="block text-[8px] font-mono text-red-400 uppercase tracking-widest font-extrabold mb-2.5 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-red-400" />
                  <span>Failed Scientific Archives ({failedTheories.length})</span>
                </span>

                <div className="max-h-[110px] overflow-y-auto space-y-1.5 pr-1">
                  {failedTheories.map(t => (
                    <div key={t.id} className="bg-red-500/5 border border-red-500/10 p-2 rounded-xl text-[9px]">
                      <div className="flex justify-between items-center text-white font-bold leading-tight truncate">
                        <span>{t.title}</span>
                      </div>
                      <p className="text-red-400/70 font-sans mt-0.5 leading-normal">{t.reasonForFailure}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
