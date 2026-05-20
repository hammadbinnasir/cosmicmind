"use client";

import React, { useState, useEffect } from 'react';
import { 
  CosmicEventBus, 
  DeepSpaceObservatory, 
  CosmicEvent, 
  PLANETARY_OBSERVATORIES 
} from '@/lib/network/CosmicEventBus';
import { 
  VerificationEngine, 
  VerificationProfile, 
  ProvenanceNode 
} from '@/lib/network/VerificationEngine';
import { 
  UniverseStateEngine, 
  TrackedAnomalyState 
} from '@/lib/network/UniverseStateEngine';
import { 
  Network, 
  Activity, 
  Compass, 
  Radio, 
  ShieldAlert, 
  Clock, 
  Zap, 
  Sliders, 
  Heart, 
  Workflow, 
  FileText, 
  CornerDownRight, 
  Eye, 
  GitPullRequest, 
  Layers, 
  Sparkles, 
  Database, 
  CloudSun,
  Server,
  Terminal,
  Cpu,
  RefreshCw
} from 'lucide-react';

export default function ObservatoryConsole() {
  const eventBus = CosmicEventBus.getInstance();
  const verificationEngine = VerificationEngine.getInstance();
  const twinEngine = UniverseStateEngine.getInstance();

  // State controls for observatories lists and events stream
  const [observatories, setObservatories] = useState<DeepSpaceObservatory[]>(() => eventBus.getObservatories());
  const [events, setEvents] = useState<CosmicEvent[]>(() => eventBus.getEvents());
  const [selectedEvent, setSelectedEvent] = useState<CosmicEvent | null>(() => {
    const evts = eventBus.getEvents();
    return evts.length > 0 ? evts[0] : null;
  });

  // Cosmic Digital Twin interactive state
  const [twinAnomalies, setTwinAnomalies] = useState<TrackedAnomalyState[]>(() => twinEngine.getTrackedAnomalies());
  const [selectedTwin, setSelectedTwin] = useState<TrackedAnomalyState | null>(() => {
    const list = twinEngine.getTrackedAnomalies();
    return list.length > 0 ? list[0] : null;
  });

  // Automated scheduling evaluation metrics
  const [schedTargetName, setSchedTargetName] = useState<string>("SGR 1900+14 Magnetar");
  const [schedWaveband, setSchedWaveband] = useState<"Optical" | "Infrared" | "Radio" | "Gamma-Ray">("Infrared");
  const [schedHumidity, setSchedHumidity] = useState<number>(15);
  const [schedWind, setSchedWind] = useState<number>(18);
  const [allocationLog, setAllocationLog] = useState<string[]>([]);
  const [recommendedAsset, setRecommendedAsset] = useState<string>("None Evaluated");

  // Dynamic system telemetry feed ticker
  const [telemetryTicker, setTelemetryTicker] = useState<string[]>([
    "[PLANETARY_CORE] Initializing telemetry stream across distributed edge ingest nodes...",
    "[KAFKA_BUS] Connection pool established. Zero packet frame-drop reported on fiber backplane.",
    "[FEDERATED_AI] Embedding vectors synchronized successfully. 512-dimension space alignment lock active."
  ]);

  // Generate automated ticker updates
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        `[TELESCOPE_POINTING] JWST updated slew buffers at ${new Date().toLocaleTimeString()} UTC.`,
        `[KAFKA_ALERT] Ingress stream peak at ${new Date().toLocaleTimeString()} UTC. Signal strength solid.`,
        `[PHYSICAL_SANDBOX] Regenerated high-precision N-body gravity geodesic solutions.`,
        `[METADATA_SYNC] Verified peer cryptographic consensus blocks on L3 Lagrange database.`,
        `[WEATHER_CORE] Mauna Kea peak reports seeing value at 0.52 arcseconds. Atmospheric visibility optimum.`
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setTelemetryTicker(prev => [randomMsg, ...prev.slice(0, 15)]);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Update digital twin steps forward
  const handlePropagateTwinState = (id: string) => {
    const updated = twinEngine.advanceSimulationEpoch(id);
    if (updated) {
      const refreshedList = twinEngine.getTrackedAnomalies();
      setTwinAnomalies([...refreshedList]);
      setSelectedTwin(updated);
    }
  };

  // Run weather-aware autonomous allocation scheduler calculations
  const runAutonomousSchedulingAllocation = () => {
    const logBatch: string[] = [
      `[11:50:35] Triggering autonomous atmospheric target matching for "${schedTargetName}"...`,
      `[11:50:36] Input Constraints: Wind: ${schedWind} km/h | Humidity: ${schedHumidity}% | Waveband: ${schedWaveband}.`
    ];

    // Find a fit out of planetary array
    const candidate = observatories.find(obs => {
      if (obs.status === "weather_lockout") return false;
      const windSafe = obs.weatherCondition.windVelocityKmh < 45 || schedWind < 45;
      const humiditySafe = obs.weatherCondition.humidityPercent < 80 || schedHumidity < 80;
      return windSafe && humiditySafe;
    });

    if (candidate) {
      logBatch.push(`[11:50:37] SUCCESS: Coaligned and allocated to target array: ${candidate.name}.`);
      setRecommendedAsset(candidate.name);
    } else {
      logBatch.push(`[11:50:37] WARNING: Elevated weather thresholds detected across active arrays. Postponing ingress target.`);
      setRecommendedAsset("None (Standard Buffer Delay)");
    }
    setAllocationLog(logBatch);
  };

  // Build a Trust Profile out of the selected Event's waveband details
  const getSelectedEventTrustProfile = (): VerificationProfile => {
    if (!selectedEvent) {
      return {
        targetId: "Unknown",
        reproducibilityScore: 0,
        uncertaintySigma: 0,
        contradictionFlags: [],
        provenance: [],
        consensusStatus: "unconfirmed"
      };
    }

    const mocks: ProvenanceNode[] = [
      {
        observatoryId: "obs-jwst",
        instrumentName: "NIRCam Multi-Spectral Ingress",
        epochTimestamp: "2026.39",
        signalToNoiseRatio: selectedEvent.signalStrengthSigma * 0.45,
        unmaskedWavenumberRange: "0.6μm - 5.0μm"
      },
      {
        observatoryId: "obs-icecube-southpole",
        instrumentName: "DOM Photomultiplier Array",
        epochTimestamp: "2026.39",
        signalToNoiseRatio: selectedEvent.signalStrengthSigma * 0.3,
        unmaskedWavenumberRange: "0.1 GeV Neutrino Threshold"
      }
    ];

    return verificationEngine.generateVerificationProfile(selectedEvent.payload.targetName, mocks);
  };

  const selectedTrust = getSelectedEventTrustProfile();

  return (
    <div className="space-y-6" id="observatory-institutional-console-root">

      {/* PLANETARY EXECUTIVE METRICS PANEL */}
      <div className="bg-[#12131A] border border-white/10 p-5 rounded-3xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="font-mono text-[9px] text-[#A0AEC0] uppercase tracking-widest font-extrabold">DISTRIBUTED DISCOVERY OVERLORD LAYER — VER: 4.8.2</span>
          </div>
          <h2 className="font-sans font-black text-white text-xl uppercase tracking-tight">PLANETARY SCIENCE OPERATING SYSTEM</h2>
          <p className="font-mono text-[10px] text-gray-450 text-slate-400">FEDERATING SIX DEEP-SPACE RECORDING NODES WITH KAFKA TELEMETRY pipelines</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-black/40 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="block text-[8px] text-gray-500 font-mono">ACTIVE SATELLITE FEEDS</span>
              <span className="font-mono text-xs text-white font-bold">18 STABLE STREAM</span>
            </div>
          </div>

          <div className="bg-black/40 border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-2.5">
            <Network className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="block text-[8px] text-gray-500 font-mono">FEDERATED EMBEDDINGS</span>
              <span className="font-mono text-xs text-white font-bold">512-D DENSE SYNC</span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: OBSERVATORY TOPOLOGY & KAFKA STREAM (SPAN 5) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* OBSERVATORY HEALTH CHECK */}
          <div className="bg-[#0a0b0e] border border-white/10 p-5 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-mono text-[9.5px] text-[#22c55e] font-extrabold uppercase tracking-widest">I. OBSERVATORY TELEMETRY DIAGNOSTICS</span>
              <Heart className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {observatories.map(obs => (
                <div key={obs.id} className="bg-white/5 border border-white/5 rounded-2xl p-3 flex justify-between items-center text-xs">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        obs.status === "active" ? "bg-emerald-400" :
                        obs.status === "weather_lockout" ? "bg-red-400" :
                        "bg-yellow-400 animate-pulse"
                      }`} />
                      <h4 className="font-sans font-extrabold text-white truncate text-xs">{obs.name}</h4>
                    </div>
                    <span className="block text-[8.5px] font-mono text-gray-500 mt-1">{obs.site} — GPS Lat: {obs.gpsCoordinates.lat}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-[8px] block uppercase tracking-wider text-cyan-405 text-cyan-400">{obs.instruments[0]}</span>
                    <span className="font-sans text-[9px] text-gray-400 font-semibold block mt-0.5">Seeing Limit: {obs.weatherCondition.seeingArcsec || 'N/A'} arcsec</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KAFKA-STYLE STREAM EVENTS */}
          <div className="bg-[#0a0b0e] border border-white/10 p-5 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="font-mono text-[9.5px] text-pink-400 font-extrabold uppercase tracking-widest">II. KAFKA EVENT STREAM TACTICAL FEEDS</span>
              <Terminal className="w-3.5 h-3.5 text-pink-400" />
            </div>

            <div className="space-y-2.5">
              {events.map(evt => (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`w-full p-3 text-left border rounded-2xl transition-all cursor-pointer block relative ${
                    selectedEvent?.id === evt.id
                      ? 'bg-[#12131A] border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.06)]'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[7.5px] font-mono text-gray-500 uppercase tracking-widest block">{evt.timestamp}</span>
                      <h4 className="font-sans font-black text-white text-xs mt-1 truncate max-w-[190px]">{evt.payload.targetName}</h4>
                    </div>
                    <span className={`text-[8px] font-mono uppercase bg-pink-500/10 text-pink-400 border border-pink-500/15 px-1.5 py-0.5 rounded font-bold`}>
                      {evt.topic.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[9.5px] font-sans text-slate-400 leading-normal line-clamp-1 mt-2">{evt.payload.description}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTION HUBS, TRUST PROFILER, SIMULATOR (SPAN 7) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* EVENT TRUST & VERIFICATION BREAKDOWN */}
          {selectedEvent ? (
            <div className="bg-[#0a0b0e] border border-white/10 p-5 rounded-3xl space-y-4 shadow-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-white/10 pb-3">
                <div>
                  <span className="font-mono text-[8px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 border border-cyan-500/20 rounded uppercase tracking-wider font-bold">III. SCIENTIFIC TRUST PORTAL</span>
                  <h3 className="font-sans font-black text-white text-sm uppercase mt-1">Ingress Trace audit: {selectedEvent.payload.targetName}</h3>
                </div>

                <div className="bg-black/50 border border-white/5 rounded-xl px-3 py-1 shrink-0 flex items-center gap-2">
                  <span className="text-[8px] text-gray-500 font-mono">STATUS:</span>
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider font-mono">{selectedTrust.consensusStatus}</span>
                </div>
              </div>

              {/* Statistical scoring charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-xs text-slate-300">
                  <span className="block text-[8px] text-gray-500 font-mono uppercase tracking-wider">Uncertainty Signatures</span>
                  <span className="block text-base font-extrabold text-white mt-1.5">{selectedTrust.uncertaintySigma} σ</span>
                  <p className="text-[9px] text-slate-400 leading-normal mt-1">Underwrites discovery limit indices in spatial vectors.</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-xs text-slate-300">
                  <span className="block text-[8px] text-gray-500 font-mono uppercase tracking-wider">Reproducibility Index</span>
                  <span className="block text-base font-extrabold text-white mt-1.5">{selectedTrust.reproducibilityScore} %</span>
                  <p className="text-[9px] text-slate-400 leading-normal mt-1">Matches verified signal amplitudes against other peers.</p>
                </div>

                <div className="bg-white/5 rounded-2xl p-3 border border-white/5 text-xs text-slate-300">
                  <span className="block text-[8px] text-gray-500 font-mono uppercase tracking-wider">Event Fluence Bounds</span>
                  <span className="block text-base font-extrabold text-white mt-1.5">{selectedEvent.signalStrengthSigma} SNR</span>
                  <p className="text-[9px] text-slate-400 leading-normal mt-1">Reflects aggregated raw photon metrics received.</p>
                </div>
              </div>

              {/* Relational provenance trace */}
              <div className="space-y-2">
                <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block pl-1">Instrument Trace Provenance Logs</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTrust.provenance.map((prov, pIdx) => (
                    <div key={pIdx} className="bg-black/45 border border-white/5 p-3 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-sans">
                        <span className="font-extrabold text-[#F5F5F7]">{prov.instrumentName}</span>
                        <span className="font-mono text-gray-500 text-[8px]">{prov.observatoryId}</span>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-mono mt-2 pt-1 border-t border-white/5">
                        <span className="text-gray-500">SNR: {prov.signalToNoiseRatio.toFixed(1)}</span>
                        <span className="text-slate-400">{prov.unmaskedWavenumberRange}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contradiction Flags warning blocks */}
              {selectedTrust.contradictionFlags.length > 0 && (
                <div className="bg-[#fb7185]/5 border border-[#fb7185]/15 p-3.5 rounded-2xl flex gap-3 text-[10px]">
                  <ShieldAlert className="w-4 h-4 text-[#fb7185] shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-mono font-bold text-[#fb7185] uppercase tracking-wider">CONTRADICTION DETECTED BY PEER AUDIT NETWORK</span>
                    <p className="text-[#fb7185] opacity-80 mt-1 leading-normal font-sans">{selectedTrust.contradictionFlags[0]}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="bg-[#0a0b0e] p-5 border border-white/5 rounded-3xl text-xs text-gray-500 text-center font-sans">
              Select an ingested cosmic event to profile peer trust verifications.
            </p>
          )}

          {/* DYNAMIC DIGITAL TWIN SIMULATOR ENGINE CONTAINER */}
          <div className="bg-[#0a0b0e] border border-white/10 p-5 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[9.5px] text-yellow-450 text-indigo-400 font-extrabold uppercase tracking-widest pl-1">IV. COSMIC DIGITAL TWIN SIMULATION</span>
                <h4 className="font-sans font-extrabold text-[#F5F5F7] text-xs uppercase mt-0.5">Run N-Body evolution prognostics on extreme environments</h4>
              </div>
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <span className="font-mono text-[8px] text-zinc-500 block uppercase tracking-widest font-extrabold pl-1">Twin Anomalies State Pool</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {twinAnomalies.map(twin => (
                    <button
                      key={twin.id}
                      onClick={() => setSelectedTwin(twin)}
                      className={`w-full p-2.5 border text-left rounded-xl transition-all cursor-pointer flex justify-between items-center ${
                        selectedTwin?.id === twin.id
                          ? 'bg-indigo-500/10 border-indigo-500/35'
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-[7px] font-mono text-gray-500 block uppercase">{twin.type}</span>
                        <h5 className="font-sans font-bold text-xs text-white truncate">{twin.name}</h5>
                      </div>
                      <span className="text-[8.5px] font-mono text-indigo-300">{twin.lastSimulatedEpoch}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTwin ? (
                <div className="bg-black border border-white/15 p-4 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all select-all">
                  <div className="space-y-2 text-[10.5px]">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                      <span className="font-mono text-gray-400 font-bold uppercase tracking-widest text-[8px]">MOCK PHYSICAL TWIN MODEL</span>
                      <span className="font-mono text-[8.5px] text-[#A0AEC0]">{selectedTwin.id.toUpperCase()}</span>
                    </div>

                    <h5 className="font-sans font-extrabold text-white text-xs">{selectedTwin.name}</h5>
                    <div className="space-y-1 text-[9.5px] font-mono leading-relaxed">
                      <div className="flex justify-between">
                        <span className="text-gray-500">MASS M_ODOT:</span>
                        <span className="text-zinc-300 font-bold">{selectedTwin.massMultiplierSolar.toExponential(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">REDSHIFT OFFSET:</span>
                        <span className="text-zinc-300 font-bold">{selectedTwin.redshiftOffset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">LUMINOSITY FLUX:</span>
                        <span className="text-emerald-400 font-bold">{selectedTwin.fluxLuminosityWatts}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 mt-3 text-right">
                    <button
                      onClick={() => handlePropagateTwinState(selectedTwin.id)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[9px] font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 justify-end"
                    >
                      <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                      <span>STEP EVOLUTION FORWARD</span>
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[10.5px] text-gray-500 my-auto text-center font-sans">Pick an anomaly to run digital twin state transformations.</p>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* AUTONOMOUS OBSERVATION ENGINE & ATMOSPHERIC COORDINATION (BOTTOM BENTO GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        
        {/* ATMOSPHERIC TARGET SCHEDULER (SPAN 7) */}
        <div className="lg:col-span-7 bg-[#0a0b0e] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <span className="font-mono text-[10px] text-yellow-405 text-amber-400 font-bold uppercase tracking-widest pl-1">V. AUTONOMOUS TARGET COEFFICIENT SCHEDULER</span>
              <h4 className="font-sans font-extrabold text-[#F5F5F7] text-xs uppercase mt-0.5">Atmospheric Condition Analysis & Instrument Match Evaluator</h4>
            </div>
            <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1.5">Target Stellar Coordinates Name</label>
              <input
                type="text"
                value={schedTargetName}
                onChange={(e) => setSchedTargetName(e.target.value)}
                className="w-full bg-black/60 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-sans text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[9px] font-mono text-gray-500 uppercase mb-1.5">Expected Waveband Priority</label>
              <select
                value={schedWaveband}
                onChange={(e) => setSchedWaveband(e.target.value as any)}
                className="w-full bg-black/60 border border-white/10 px-3 py-2 rounded-xl text-xs font-sans text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Optical">Optical (Astrometry)</option>
                <option value="Infrared">Infrared (Cosmic Dust)</option>
                <option value="Radio">Radio (Pulsars & FRBs)</option>
                <option value="Gamma-Ray">Gamma-Ray (Hyper-flares)</option>
              </select>
            </div>

            <div className="flex items-end shadow-2xl">
              <button
                onClick={runAutonomousSchedulingAllocation}
                className="w-full py-2 bg-amber-505 bg-amber-500 text-black hover:bg-amber-400 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)]"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Evaluate Best Sensor Allocation</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono uppercase text-gray-400 pl-1">
                  <span>Relative Local Humidity Index:</span>
                  <span className="text-zinc-300 font-bold">{schedHumidity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={schedHumidity}
                  onChange={(e) => setSchedHumidity(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono uppercase text-gray-400 pl-1">
                  <span>Seeing Wind Velocity limits:</span>
                  <span className="text-zinc-300 font-bold">{schedWind} km/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={schedWind}
                  onChange={(e) => setSchedWind(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            <div className="bg-[#12131A] border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[7.5px] font-mono text-gray-505 text-gray-500 uppercase tracking-widest pl-1">ALLOCATION OUTCOME RESULT</span>
                <span className="text-[12px] font-sans font-black text-rose-350 block mt-1 uppercase text-amber-450 text-amber-400">{recommendedAsset}</span>
              </div>
              <p className="text-[9.5px] font-sans text-slate-400 leading-normal mt-1.5 border-t border-white/5 pt-1.5 pl-1">
                Matches targeted waveband priority against observatory GPS elevation parameters automatically on the fly.
              </p>
            </div>
          </div>

          {allocationLog.length > 0 && (
            <div className="bg-black border border-white/5 p-3 rounded-2xl font-mono text-[9px] text-[#A0AEC0] space-y-1 select-all">
              {allocationLog.map((log, idx) => (
                <p key={idx} className="leading-relaxed">{log}</p>
              ))}
            </div>
          )}
        </div>

        {/* ENTERPRISE WORKSPACES & PERMISSIONS LOGS (SPAN 5) */}
        <div className="lg:col-span-5 bg-[#0a0b0e] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[10px] text-[#818cf8] font-bold uppercase tracking-widest">VI. INSTITUTIONAL SECURITY CREDENTIAL LOGS</span>
                <h4 className="font-sans font-extrabold text-[#F5F5F7] text-xs uppercase mt-0.5">Enterprise Workspaces & secure research vaults</h4>
              </div>
              <Server className="w-4 h-4 text-[#818cf8]" />
            </div>

            <div className="space-y-2 text-[10px] leading-relaxed">
              <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl flex justify-between">
                <span className="font-sans font-bold text-white">Institutional Key Block:</span>
                <span className="font-mono text-[#818cf8] font-bold uppercase">C-MIND-L3-FEDERATED</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl flex justify-between">
                <span className="font-sans font-bold text-white">Compliance Standard:</span>
                <span className="font-mono text-emerald-400 font-bold uppercase">ISO-ASTRO-2026</span>
              </div>
              <div className="bg-white/5 border border-white/5 p-2.5 rounded-xl flex justify-between">
                <span className="font-sans font-bold text-white">Encryption Vaults:</span>
                <span className="font-mono text-slate-400 uppercase">AES-256 Bit Sealed</span>
              </div>
            </div>
          </div>

          <div className="bg-black border border-white/10 p-3 rounded-2xl">
            <span className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">TELEMETRY SECTOR PACKETS INDICES</span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 text-[8.5px] font-mono text-slate-400 select-all">
              {telemetryTicker.map((tick, idx) => (
                <p key={idx} className="leading-normal truncate">{tick}</p>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* THREE PILLAR ARCHITECTURAL SCALING SCHEMAS */}
      <div className="bg-[#0a0b0e] border border-white/10 p-5 rounded-3xl space-y-4 shadow-2xl">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div>
            <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest pl-1">VII. PLANETARY ENTERPRISE DEPLOYMENT SCALING BLUEPRINTS</span>
            <h4 className="font-sans font-extrabold text-[#F5F5F7] text-xs uppercase mt-0.5">Distributed Kubernetes topologies, vector databases, and future AGI telescope roadmaps</h4>
          </div>
          <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3 hover:border-white/10 transition-all select-all">
            <h5 className="font-sans font-extrabold text-white text-xs flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kubernetes Deployment Topology</span>
            </h5>
            <div className="font-mono text-[9px] text-slate-400 space-y-1 leading-normal">
              <p>• Multi-Cloud Ingress Pods auto-elastic replica groups.</p>
              <p>• Edge Kafka cluster pods capturing raw telescope arrays.</p>
              <p>• Gpu Nodes running Gemini 3.5 deep spectral embeddings.</p>
              <p>• Redundant failover routing across 3 planetary cloud clusters.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3 hover:border-white/10 transition-all select-all">
            <h5 className="font-sans font-extrabold text-white text-xs flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-pink-400" />
              <span>Object Storage Pipelines</span>
            </h5>
            <div className="font-mono text-[9px] text-slate-400 space-y-1 leading-normal">
              <p>• Multi-band fits imagery saved in cold archival storage.</p>
              <p>• High-performance CDN cache boundaries at Edge layers.</p>
              <p>• Milvus dense vector indexing maps coordinate proximity.</p>
              <p>• Decoupled microservices stream telemetry into Kafka lakes.</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl space-y-3 hover:border-white/10 transition-all select-all">
            <h5 className="font-sans font-extrabold text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Future AGI Discovery Roadmap</span>
            </h5>
            <div className="font-mono text-[9px] text-slate-400 space-y-1 leading-normal">
              <p>• Self-improving anomaly discovery loop triggers automated alerts.</p>
              <p>• Deep-space probes autonomously point targeting matrices.</p>
              <p>• Multi-agent feedback loop designs astrophysical theories.</p>
              <p>• Robotic observatories swarm coordinates without human keys.</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
