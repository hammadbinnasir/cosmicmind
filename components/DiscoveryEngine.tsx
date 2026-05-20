"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ResearchWorkflowEngine, 
  WorkflowJob, 
  Hypothesis, 
  KnowledgeNode, 
  COSMIC_KNOWLEDGE_GRAPH, 
  calculateAnomalyPriorityScore 
} from '@/lib/agents/ResearchWorkflowEngine';
import { 
  Cpu, 
  Terminal, 
  Layers, 
  Sliders, 
  Activity, 
  Workflow, 
  GitBranch, 
  Network, 
  FileText, 
  CheckCircle, 
  AlertOctagon, 
  Users, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Satellite, 
  Zap, 
  Send, 
  RotateCcw, 
  Download, 
  ThumbsUp,
  LineChart,
  Tv,
  Eye,
  Crosshair,
  Lock,
  Compass as NavigatorIcon
} from 'lucide-react';

export default function DiscoveryEngine() {
  const engine = ResearchWorkflowEngine.getInstance();
  const [jobs, setJobs] = useState<WorkflowJob[]>(() => engine.getJobs());
  const [selectedJob, setSelectedJob] = useState<WorkflowJob | null>(() => {
    const initialJobs = engine.getJobs();
    return initialJobs.length > 0 ? initialJobs[0] : null;
  });
  
  // Interactive inputs for Custom Investigation Launch
  const [newTargetName, setNewTargetName] = useState<string>("");
  const [newCoords, setNewCoords] = useState<string>("RA 17h 45m 40.0s, Dec -29° 00' 28\"");
  
  // Search state for Cosmic Knowledge Graph
  const [graphSearch, setGraphSearch] = useState<string>("");
  const [graphNodes, setGraphNodes] = useState<KnowledgeNode[]>(COSMIC_KNOWLEDGE_GRAPH);
  const [selectedGraphNode, setSelectedGraphNode] = useState<KnowledgeNode | null>(COSMIC_KNOWLEDGE_GRAPH[0]);

  // Interactive Prioritizer variables
  const [priorityRarity, setPriorityRarity] = useState<number>(85);
  const [priorityUncertainty, setPriorityUncertainty] = useState<number>(70);
  const [priorityImportance, setPriorityImportance] = useState<number>(90);
  const [priorityNovelty, setPriorityNovelty] = useState<number>(80);
  const [priorityInconsistency, setPriorityInconsistency] = useState<number>(75);

  // Sync priority score calculation in real time during rendering loop
  const livePriorityScore = calculateAnomalyPriorityScore({
    rarity: priorityRarity,
    uncertainty: priorityUncertainty,
    scientificImportance: priorityImportance,
    novelty: priorityNovelty,
    crossCatalogInconsistency: priorityInconsistency
  });

  // Collaboration team members chat logs
  const [teamLogs, setTeamLogs] = useState<Array<{ id: number; author: string; role: string; text: string; time: string }>>([
    { id: 1, author: "Dr. Elena Rostov", role: "Stellar Observer", text: "Ingress spectra verification shows H-alpha emission lines at +420km/s. Speculation on stellar wind shock fronts looks solid.", time: "11:21 AM" },
    { id: 2, author: "Prof. Keith Vance", role: "Theoretical Cosmologist", text: "The double Einstein arc morphology correlates perfectly with the 98.4 priority anomaly score. This is definitely a compressed lensing field.", time: "11:32 AM" },
    { id: 3, author: "ASTR-BOT-9", role: "Telemetry Guard", text: "ASCOM telescope pointing limits co-aligned on Target coordinate stream. Slew locks established and solid.", time: "11:35 AM" }
  ]);
  const [collaborativeMsg, setCollaborativeMsg] = useState<string>("");

  // System active terminal scroll state
  const terminalRef = useRef<HTMLDivElement>(null);

  const handleLaunchWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTargetName.trim()) return;

    const newJob = engine.addJob(newTargetName, newCoords, livePriorityScore);
    const updatedJobs = engine.getJobs();
    setJobs([...updatedJobs]);
    setSelectedJob(newJob);
    setNewTargetName("");

    // Automatically trigger autonomous agentic execution simulation
    engine.executeJob(newJob.id, (updated) => {
      setJobs([...engine.getJobs()]);
      setSelectedJob(prev => prev?.id === updated.id ? { ...updated } : prev);
    });
  };

  const handleRelaunchJob = (jobId: string) => {
    engine.executeJob(jobId, (updated) => {
      setJobs(engine.getJobs());
      setSelectedJob(prev => prev?.id === updated.id ? { ...updated } : prev);
    });
  };

  const clearJobsList = () => {
    engine.clearAllJobs();
    const cleanJobs = engine.getJobs();
    setJobs(cleanJobs);
    setSelectedJob(cleanJobs[0]);
  };

  // Hypotheses voting interactive element
  const handleVoteHypothesis = (hypoId: string) => {
    if (!selectedJob) return;
    
    // Deep copy hypotheses to protect state immutability
    const updatedHypotheses = selectedJob.hypotheses.map(h => {
      if (h.id === hypoId) {
        const isVoted = !h.voted;
        return {
          ...h,
          voted: isVoted,
          votes: isVoted ? h.votes + 1 : Math.max(0, h.votes - 1)
        };
      }
      return h;
    });

    const updatedJob = {
      ...selectedJob,
      hypotheses: updatedHypotheses
    };

    setSelectedJob(updatedJob);

    // Safe state copy write-back updates
    const foundIndex = jobs.findIndex(j => j.id === selectedJob.id);
    if (foundIndex !== -1) {
      const updatedJobs = [...jobs];
      updatedJobs[foundIndex] = updatedJob;
      setJobs(updatedJobs);
    }
  };

  const searchKnowledgeGraph = (query: string) => {
    setGraphSearch(query);
    if (!query.trim()) {
      setGraphNodes(COSMIC_KNOWLEDGE_GRAPH);
      return;
    }
    const filtered = COSMIC_KNOWLEDGE_GRAPH.filter(n => 
      n.label.toLowerCase().includes(query.toLowerCase()) || 
      n.type.toLowerCase().includes(query.toLowerCase())
    );
    setGraphNodes(filtered);
  };

  const addCollaborativeMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collaborativeMsg.trim()) return;
    const newMsg = {
      id: Date.now(),
      author: "Co-Investigator (You)",
      role: "Observer Principal",
      text: collaborativeMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTeamLogs([...teamLogs, newMsg]);
    setCollaborativeMsg("");
  };

  return (
    <div className="space-y-6" id="autonomous-discovery-engine-root">
      
      {/* HEADER CONTROLS AND PIPELINE STATUS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-[#12131A] border border-white/10 p-5 rounded-3xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[9px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded">SYSTEM RUN STATE: AUTONOMOUS AGI INVESTIGATOR</span>
          </div>
          <h2 className="font-sans font-extrabold text-[#F5F5F7] text-xl tracking-tight uppercase">AUTONOMOUS DISCOVERY CORE ENGINE</h2>
          <p className="font-mono text-[10px] text-slate-400 tracking-wider">CHANNELS INGESTS SEVEN SECURE NEURAL AGENTS REDIRECTING REAL-TIME SPECTROMETRY LOGS</p>
        </div>

        {/* Action controls button group */}
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={clearJobsList}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all rounded-xl text-[10px] font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET WORKFLOWS HISTORY</span>
          </button>
        </div>
      </div>

      {/* THREE BENTO PANELS GRID CONFIG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* PANEL A: WORKFLOW INITIATOR & QUEUE TRAFFIC (SPAN 4) */}
        <div className="lg:col-span-4 bg-[#0a0b0e] border border-white/10 rounded-3xl p-5 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest font-extrabold block">I. DISCOVERY TASK INITIATION</span>
              <Workflow className="w-3.5 h-3.5 text-cyan-400" />
            </div>

            {/* Launch new custom job form */}
            <form onSubmit={handleLaunchWorkflow} className="space-y-3.5 bg-white/5 border border-white/5 p-4 rounded-2xl">
              <span className="block text-[8px] font-mono text-cyan-400 uppercase tracking-widest font-bold">Launch AI Research Workflow</span>
              
              <div>
                <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Observation Target Name</label>
                <input
                  type="text"
                  placeholder="e.g. SGR 1806 Magnetar, NGC 1052"
                  value={newTargetName}
                  onChange={(e) => setNewTargetName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 px-3 py-2 rounded-xl text-xs font-sans text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1">Target Coordinates (Eq RA/Dec)</label>
                <input
                  type="text"
                  placeholder="RA 14h, Dec +54°"
                  value={newCoords}
                  onChange={(e) => setNewCoords(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 px-3 py-2 rounded-xl text-xs font-mono text-zinc-300 placeholder-gray-650 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!newTargetName.trim()}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    newTargetName.trim()
                      ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed'
                  }`}
                  id="launcher-workflow-submit"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch Cognitive Workflow</span>
                </button>
              </div>
            </form>

            {/* Active investigation queue list */}
            <div className="space-y-2.5">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-extrabold block">AI COGNITIVE JOBS HISTORY</span>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`w-full p-3 border text-left rounded-2xl transition-all cursor-pointer block relative ${
                      selectedJob?.id === job.id
                        ? 'bg-[#12131A] border-cyan-550 border-cyan-500/45 shadow-[0_0_15px_rgba(6,182,212,0.06)]'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    {/* Floating status flag */}
                    <span className="absolute top-3 right-3 text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase flex items-center gap-1">
                      <span className={`w-1 h-1 rounded-full ${
                        job.status === "completed" ? "bg-emerald-400" :
                        job.status === "running" ? "bg-cyan-400 animate-pulse" :
                        "bg-gray-400"
                      }`} />
                      <span className="text-[7px] text-gray-400">{job.status}</span>
                    </span>

                    <h4 className="font-sans font-extrabold text-xs text-white truncate max-w-[150px]">{job.targetName}</h4>
                    <span className="block font-mono text-[8.5px] text-gray-500 mt-1">{job.coordinates}</span>

                    <div className="flex justify-between items-center mt-2.5 border-t border-white/5 pt-2">
                      <span className="text-[8px] font-mono text-[#ec4899] bg-[#ec4899]/5 border border-[#ec4899]/15 px-1.5 py-0.5 rounded">PRIORITY: {job.priorityScore}</span>
                      {job.status === "running" ? (
                        <div className="w-16 bg-white/10 h-1 rounded-full overflow-hidden shrink-0">
                          <div className="bg-cyan-400 h-full animate-pulse" style={{ width: `${job.progress}%` }} />
                        </div>
                      ) : (
                        <span className="text-[8px] font-mono text-gray-505 text-gray-500">
                          {job.status === "completed" ? "✓ REDUCED" : "PENDING COGNITION"}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Autonomous active observatories widget */}
          <div className="bg-emerald-950/15 border border-emerald-500/20 p-4 rounded-2xl space-y-2 mt-4 text-[10px]">
            <div className="flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-emerald-300 font-bold uppercase tracking-wider">TELESCOPE POINTING CORE</span>
            </div>
            <p className="text-slate-400 leading-normal font-sans">
              Bidirectional ASCOM driver locks targeted coordinate buffers dynamically and programs robotic slew trajectories immediately upon score analysis completion.
            </p>
            <div className="flex justify-between items-center bg-black/50 border border-white/5 p-2 rounded-xl text-[9px] font-mono mt-2">
              <span className="text-gray-500">CURRENT ASCOM SLEW:</span>
              <span className="text-emerald-400 animate-pulse font-bold">READY / LOCKOUT STABLE</span>
            </div>
          </div>
        </div>

        {/* PANEL B: WORKFLOW ORCHESTRATOR & THE REASONING TRACE (SPAN 8) */}
        <div className="lg:col-span-8 space-y-5">
          
          {selectedJob ? (
            <div className="bg-[#0a0b0e] border border-white/10 rounded-3xl p-5 space-y-5 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded font-mono text-[8px] font-extrabold text-cyan-400 uppercase tracking-widest">JOB ID: {selectedJob.id}</span>
                    <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded font-mono text-[8px] font-extrabold text-pink-400 uppercase tracking-widest">DISCOVERY SCORE: {selectedJob.priorityScore}</span>
                  </div>
                  <h3 className="font-sans font-extrabold text-white text-base">ACTIVE DISCOVERY GRAPH ON: {selectedJob.targetName.toUpperCase()}</h3>
                </div>

                {selectedJob.status === "completed" && (
                  <button
                    onClick={() => handleRelaunchJob(selectedJob.id)}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-[9px] font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Relaunch Agentic Trace</span>
                  </button>
                )}
              </div>

              {/* Progress Indicator steps pipeline */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">ORCHESTRATED COGNITIVE AGENT STEPS TRACE</span>
                  <span className="font-mono text-cyan-400 font-bold">{selectedJob.progress}% COMPLETE</span>
                </div>
                
                {/* Visual Step Timeline bar */}
                <div className="grid grid-cols-7 gap-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  {selectedJob.steps.map((s, sIdx) => (
                    <div 
                      key={sIdx} 
                      className={`h-full transition-all duration-500 ${
                        s.status === "completed" ? "bg-emerald-500" :
                        s.status === "running" ? "bg-cyan-400 animate-pulse" :
                        "bg-white/5"
                      }`} 
                    />
                  ))}
                </div>

                {/* Vertical Expanded trace listing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    {selectedJob.steps.map((step, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-2xl border transition-all text-xs flex gap-3 ${
                          step.status === "running"
                            ? 'bg-cyan-500/5 border-cyan-500/30'
                            : step.status === "completed"
                            ? 'bg-emerald-500/5 border-emerald-500/10'
                            : 'bg-black/30 border-white/5 opacity-55'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full font-mono font-bold text-[9px] flex items-center justify-center shrink-0 ${
                          step.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                          step.status === "running" ? "bg-cyan-400 text-black animate-pulse" :
                          "bg-white/5 text-gray-500"
                        }`}>{idx + 1}</span>
                        
                        <div className="space-y-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-sans font-bold text-[#F5F5F7] truncate">{step.name}</span>
                            <span className="font-mono text-[7px] text-gray-400 shrink-0 uppercase tracking-wider">{step.agent}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">{step.description}</p>
                          {step.retries > 0 && (
                            <span className="inline-block text-[8px] font-mono text-[#f59e0b] bg-yellow-405 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/25 uppercase">RESILIENCE RETRY RUN: {step.retries}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Half: Live agent telemetry output feed */}
                  <div className="flex flex-col bg-black border border-white/10 p-4 rounded-2xl space-y-3 h-[360px]">
                    <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 border-b border-white/10 pb-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        <span>REASONING PIPELINE PROCESS DIAGNOSTICS</span>
                      </span>
                      <span>NODE: NEURAL_L3</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[9px] pr-1" ref={terminalRef}>
                      {selectedJob.logs.map((log, lIdx) => (
                        <div key={lIdx} className="text-slate-300 leading-normal">
                          <p className="whitespace-pre-wrap select-all selection:bg-cyan-500/20">{log}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-gray-500 block uppercase tracking-widest font-extrabold">COGNITION LATENCY</span>
                        <span className="font-mono text-[10px] text-zinc-300 font-bold">1432ms - DELTA HIGH</span>
                      </div>
                      <div className="space-y-0.5 text-right">
                        <span className="text-[8px] text-gray-500 block uppercase tracking-widest font-extrabold">PRIMARY CORE</span>
                        <span className="font-mono text-[10px] text-emerald-400 font-bold">gemini-3.5-flash</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SCIENTIFIC HYPOTHESIS GENERATION & THEORIES */}
              {selectedJob.hypotheses && selectedJob.hypotheses.length > 0 && (
                <div className="border-t border-white/10 pt-5 space-y-4">
                  <div>
                    <span className="font-mono text-[9px] text-pink-400 bg-pink-500/5 px-2.5 py-1 rounded border border-pink-500/10 uppercase tracking-widest font-bold inline-block mb-1">MODULE_IV: HIGH-FIDELITY HYPOTHESIS MODELING</span>
                    <h4 className="font-sans font-extrabold text-[#F5F5F7] text-sm uppercase">Active Physics Hypotheses Competing Rankings</h4>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">Each explanation separates raw observation from inferred astrophysical mechanics with full collaborative peer-review vote registers.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedJob.hypotheses.map(hypo => (
                      <div key={hypo.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all select-all">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start border-b border-white/5 pb-2">
                            <div>
                              <span className="block text-[8px] font-mono text-cyan-400 uppercase tracking-wider">{hypo.proposer} PROPOSAL</span>
                              <h5 className="font-sans font-extrabold text-white text-xs mt-0.5">{hypo.title}</h5>
                            </div>
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono text-[9px] px-2 py-0.5 font-bold">CONF: {hypo.confidenceScore}%</span>
                          </div>

                          {/* Scientific structure breakdown */}
                          <div className="space-y-2 text-[10px] leading-relaxed">
                            <div>
                              <strong className="font-mono text-[8px] text-slate-500 uppercase tracking-widest font-bold block mb-0.5">1. OBSERVATION</strong>
                              <p className="text-zinc-300 font-sans">{hypo.observation}</p>
                            </div>
                            <div>
                              <strong className="font-mono text-[8px] text-slate-500 uppercase tracking-widest font-bold block mb-0.5">2. INFERENCE</strong>
                              <p className="text-zinc-300 font-sans">{hypo.inference}</p>
                            </div>
                            <div>
                              <strong className="font-mono text-[8px] text-slate-500 uppercase tracking-widest font-bold block mb-0.5">3. SPECULATION / THEORY</strong>
                              <p className="text-zinc-300 font-sans">{hypo.speculation}</p>
                            </div>
                            <div>
                              <strong className="font-mono text-[8px] text-slate-500 uppercase tracking-widest font-bold block mb-0.5">4. CONCLUSION</strong>
                              <p className="text-zinc-300 font-sans">{hypo.conclusion}</p>
                            </div>
                          </div>
                        </div>

                        {/* Peer Voting & Micro-Interactions */}
                        <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-3">
                          <span className="text-[8px] font-mono text-gray-500">COLLABORATORS AGREEMENT</span>
                          <button
                            onClick={() => handleVoteHypothesis(hypo.id)}
                            className={`flex items-center gap-1.5 px-3 py-1 font-mono text-[9px] rounded-lg transition-all cursor-pointer ${
                              hypo.voted 
                                ? 'bg-emerald-500 text-black font-extrabold' 
                                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>VOTE ({hypo.votes})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RESEARCH PUBLICATION-STYLE REPORT EXPORT MODULE */}
              {selectedJob.reportMarkdown && (
                <div className="border-t border-white/10 pt-5 space-y-3 bg-[#0a0b0e] rounded-2xl">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <span className="font-mono text-[9px] text-purple-400 bg-purple-500/5 px-2 py-0.5 border border-purple-500/15 rounded uppercase tracking-wider font-bold">MODULE_V: PEER JOURNAL COMPILER</span>
                      <h4 className="font-sans font-extrabold text-[#F5F5F7] text-sm uppercase mt-1">Export Publication-Ready Astrophysics Manuscripts</h4>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const blob = new Blob([selectedJob.reportMarkdown || ''], { type: 'text/markdown' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedJob.targetName.toLowerCase().replace(/[\s*]+/g, '-')}-report.md`;
                          a.click();
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all rounded-lg text-[9px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>MARKDOWN</span>
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([selectedJob.reportLatex || ''], { type: 'text/latex' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedJob.targetName.toLowerCase().replace(/[\s*]+/g, '-')}.tex`;
                          a.click();
                        }}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all rounded-lg text-[9px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>LaTeX (AASTeX)</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/80 rounded-xl border border-white/5 p-4 max-h-56 overflow-y-auto font-mono text-[9px] text-[#A0AEC0] leading-relaxed select-all">
                    {selectedJob.reportMarkdown}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-[#0a0b0e] border border-white/10 rounded-3xl p-8 text-center text-slate-400">
              <Compass className="w-10 h-10 text-cyan-400/60 mx-auto mb-3 animate-spin" style={{ animationDuration: '6s' }} />
              <p className="font-sans text-xs">No core search jobs running. Launch or select an investigation profile in the sidebar queue.</p>
            </div>
          )}

        </div>
      </div>

      {/* ADDITIONAL OPERATIONAL HUBS PANELS (BOTTOM GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        
        {/* PANEL C: DETAILED COSMIC KNOWLEDGE GRAPH Traversals (SPAN 7) */}
        <div className="lg:col-span-7 bg-[#0a0b0e] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest">V. COSMIC KNOWLEDGE GRAPH INDEX</span>
              <h4 className="font-sans font-extrabold text-[#F5F5F7] text-xs uppercase mt-0.5">Semantic Similarities & Relational Proximity</h4>
            </div>
            <Network className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>

          <div className="flex gap-2.5">
            <input
              type="text"
              placeholder="Search cosmic index node relationships..."
              value={graphSearch}
              onChange={(e) => searchKnowledgeGraph(e.target.value)}
              className="flex-1 bg-black/60 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-sans text-zinc-350 focus:outline-none focus:border-emerald-500 transition-all font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {graphNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => setSelectedGraphNode(node)}
                  className={`w-full p-2.5 border text-left rounded-xl transition-all cursor-pointer flex justify-between items-center ${
                    selectedGraphNode?.id === node.id
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[7.5px] font-mono text-gray-500 uppercase tracking-wider block">{node.type}</span>
                    <h5 className="font-sans font-bold text-xs text-white truncate">{node.label}</h5>
                  </div>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                    node.anomalyScore > 80 ? 'bg-pink-500/10 text-pink-400' : 'bg-gray-400/10 text-gray-400'
                  }`}>SCORE: {node.anomalyScore}</span>
                </button>
              ))}
            </div>

            {/* Traversed Node details visualizer */}
            {selectedGraphNode ? (
              <div className="bg-black/60 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                    <span className="font-mono text-[8.5px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded">CONNECTED SPECIMEN</span>
                    <span className="font-mono text-[8px] text-gray-500 font-semibold">{selectedGraphNode.id.toUpperCase()}</span>
                  </div>

                  <h5 className="font-sans font-extrabold text-white text-xs mb-2 leading-relaxed">{selectedGraphNode.label}</h5>
                  <div className="space-y-1.5 text-[9.5px]">
                    {Object.entries(selectedGraphNode.attributes || {}).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 uppercase font-mono">{key}:</span>
                        <span className="text-zinc-300 font-bold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-3">
                  <span className="text-[8px] font-mono text-gray-500 block mb-1 uppercase tracking-wider">MAP CONNECTIONS ({selectedGraphNode.connections.length})</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedGraphNode.connections.map(conId => (
                      <span key={conId} className="text-[8px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10 text-gray-400">{conId}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center md:my-auto text-[11px] text-gray-500">Pick any cosmic relational node to map its proximity connections.</p>
            )}
          </div>
        </div>

        {/* PANEL D: REAL-TIME COLLABORATIVE SCIENCE FEED (SPAN 5) */}
        <div className="lg:col-span-5 bg-[#0a0b0e] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">VI. PEER SCIENCE CHANNEL</span>
                <h4 className="font-sans font-extrabold text-[#F5F5F7] text-xs uppercase mt-0.5">Live Team Chat & Autonomous Telemetry</h4>
              </div>
              <Users className="w-4 h-4 text-indigo-400 shrink-0" />
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {teamLogs.map(log => (
                <div key={log.id} className="text-[10px] bg-white/5 p-2.5 rounded-xl space-y-1 border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="font-sans font-extrabold text-white text-[11px]">{log.author} <span className="text-[7.5px] font-mono text-indigo-400 bg-indigo-500/10 px-1 py-0.5 rounded ml-1 uppercase">{log.role}</span></span>
                    <span className="text-[8px] font-mono text-gray-500">{log.time}</span>
                  </div>
                  <p className="text-zinc-350 leading-relaxed font-sans">{log.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form to dispatch chat message */}
          <form onSubmit={addCollaborativeMsg} className="flex gap-2 pt-3 border-t border-white/10">
            <input
              type="text"
              placeholder="Send coordinate verification data..."
              value={collaborativeMsg}
              onChange={(e) => setCollaborativeMsg(e.target.value)}
              className="flex-1 bg-black/80 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-1 px-3 bg-indigo-550 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs cursor-pointer flex items-center justify-center transition-all shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* PANEL E: INTERACTIVE ANOMALY PRIORITIZATION CALCULATOR (BENTO ACCENT) */}
      <div className="bg-[#0a0b0e] border border-white/10 p-5 rounded-3xl space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div>
            <span className="font-mono text-[10px] text-pink-400 font-bold uppercase tracking-widest">VII. ANOMALY PRIORITIZATION MATRIX SCORER</span>
            <h4 className="font-sans font-extrabold text-[#F5F5F7] text-xs uppercase mt-0.5">Telescope Target Prioritization weights algorithm slider</h4>
          </div>
          <Sliders className="w-4 h-4 text-pink-400 shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400">
              <span>RARITY WEIGHT:</span>
              <span className="text-zinc-300 font-bold">{priorityRarity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priorityRarity}
              onChange={(e) => setPriorityRarity(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400">
              <span>PHYSICS UNCERTAINTY:</span>
              <span className="text-zinc-300 font-bold">{priorityUncertainty}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priorityUncertainty}
              onChange={(e) => setPriorityUncertainty(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400">
              <span>IMPORTANCE RATING:</span>
              <span className="text-zinc-300 font-bold">{priorityImportance}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priorityImportance}
              onChange={(e) => setPriorityImportance(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400">
              <span>NOVELTY COEFFICIENT:</span>
              <span className="text-zinc-300 font-bold">{priorityNovelty}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priorityNovelty}
              onChange={(e) => setPriorityNovelty(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-mono uppercase text-gray-400">
              <span>CATALOG DISCREPANCY:</span>
              <span className="text-zinc-300 font-bold">{priorityInconsistency}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priorityInconsistency}
              onChange={(e) => setPriorityInconsistency(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>

        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest font-extrabold">LIVE CALCULATOR OUTPUT INDICATOR</span>
            <p className="text-slate-300 font-sans mt-0.5">High-priority targets automatically reschedule regional Ground Robotic telescoping sweep slots on completion.</p>
          </div>
          
          <div className="bg-black/60 border border-[#ec4899]/30 rounded-xl px-6 py-2 shrink-0 flex items-center gap-3">
            <span className="text-[10px] text-gray-450 uppercase font-mono tracking-wider font-semibold text-[#ec4899]">SCORE:</span>
            <span className="text-lg font-mono font-extrabold text-[#F5F5F7]">{livePriorityScore} / 100</span>
          </div>
        </div>
      </div>

    </div>
  );
}
