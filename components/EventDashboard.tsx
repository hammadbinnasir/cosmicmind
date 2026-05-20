"use client";

import React, { useState, useEffect } from 'react';
import { COSMIC_EVENTS, CosmicEvent } from '@/lib/mockData';
import { Bell, Radio, Zap, ShieldAlert, Cpu, Sparkles, Orbit, RefreshCw, RadioTower } from 'lucide-react';

interface EventDashboardProps {
  onCoordinateLock?: (ra: string, dec: string) => void;
}

export default function EventDashboard({ onCoordinateLock }: EventDashboardProps) {
  const [events, setEvents] = useState<CosmicEvent[]>(COSMIC_EVENTS);
  const [streamTicks, setStreamTicks] = useState<number>(0);
  const [activeAlertCount, setActiveAlertCount] = useState<number>(4);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [loadingLive, setLoadingLive] = useState<boolean>(false);
  const [feedLogs, setFeedLogs] = useState<string[]>([
    "Transit detected: SN-2026_V1A flare threshold exceedance. 100GeV flux confirmed.",
    "Gravitational Wave Chirp active. Target index GW-260520. Curvature displacement peak.",
    "Tracking asteroid vector NEO-2026_XS4. Right Ascension 21h04m target locks stabilized.",
    "Telemetry buffers synchronized. Stellar density grids recalculated successfully across clusters."
  ]);

  const loadLiveAstroFeed = async (showToast = false) => {
    setLoadingLive(true);
    try {
      const res = await fetch("/api/astro-feed");
      const data = await res.json();
      if (data.success) {
        const nonAsteroids = COSMIC_EVENTS.filter(e => e.type !== 'Asteroid Vector');
        const liveAsteroidsMapped = data.liveAsteroids || [];
        setEvents([...nonAsteroids, ...liveAsteroidsMapped]);
        setActiveAlertCount(nonAsteroids.length + liveAsteroidsMapped.length);
        setIsLive(true);

        const timestampStr = new Date().toLocaleTimeString();
        const logs = [
          `NASA NeoWs Feed active. Streamed ${liveAsteroidsMapped.length} tracked asteroids passing Earth today!`,
          `Live space observation logged: APOD "${data.apodData?.title || 'Unknown Object'}" target co-signed.`,
          `Dispatched updated orbit tracking matrices to active telemetry hubs.`
        ];
        setFeedLogs(prev => [...logs, ...prev].slice(0, 8));
      } else {
        throw new Error(data.error || "Failed key confirmation");
      }
    } catch (err) {
      console.warn("NASA API Live Stream connection lost, reverting to simulated baseline:", err);
      // Fallback
      setEvents(COSMIC_EVENTS);
      setIsLive(false);
    } finally {
      setLoadingLive(false);
    }
  };

  useEffect(() => {
    // Connect live NASA feed deferred after mount
    const timer = setTimeout(() => {
      loadLiveAstroFeed();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleFeedMode = () => {
    if (isLive) {
      setEvents(COSMIC_EVENTS);
      setActiveAlertCount(COSMIC_EVENTS.length);
      setIsLive(false);
      setFeedLogs(prev => ["Returned to local Simulated baseline stream.", ...prev].slice(0, 8));
    } else {
      loadLiveAstroFeed(true);
    }
  };

  // Countdown timer simulation for transient signals
  useEffect(() => {
    const timer = setInterval(() => {
      setEvents(prevEvents => 
        prevEvents.map(evt => {
          if (evt.timeRemainingSec && evt.timeRemainingSec > 0) {
            return { ...evt, timeRemainingSec: evt.timeRemainingSec - 1 };
          } else if (evt.timeRemainingSec === 0) {
            // Signal expired. Trigger mock next signal
            return {
              ...evt,
              timeRemainingSec: Math.floor(Math.random() * 5000 + 400),
              intensity: `${(Math.random() * 10 + 1).toFixed(1)} x 10^45 Watts`,
              timestamp: "Transit Recalculated: Just Now"
            };
          }
          return evt;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulating live satellite telemetry updates blinking
  useEffect(() => {
    const streamTimer = setInterval(() => {
      setStreamTicks(prev => prev + 1);
    }, 3000);
    return () => clearInterval(streamTimer);
  }, []);

  const formatCountdown = (secs?: number) => {
    if (!secs) return "CONT-TRACKING";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleScopeWarp = (coords: string) => {
    if (!onCoordinateLock) return;
    const parts = coords.split('/');
    const ra = parts[0]?.replace('RA', '').trim() || "";
    const dec = parts[1]?.replace('DEC', '').trim() || "";
    onCoordinateLock(ra, dec);
  };

  return (
    <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col h-full backdrop-blur-sm shadow-2xl" id="event-dashboard-root">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-cyan-400'} animate-ping`} />
            <h2 className="font-sans font-semibold text-lg text-white tracking-wider uppercase flex items-center gap-2">
              DYNAMIC SPACE TRANSITS MONITOR
              {isLive ? (
                <span className="text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded font-mono tracking-widest uppercase">
                  ● REAL NASA DATA ACTIVE
                </span>
              ) : (
                <span className="text-[9px] bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded font-mono tracking-widest uppercase">
                  LOCAL SIMULATION
                </span>
              )}
            </h2>
          </div>
          <p className="text-xs text-slate-400">Broadcasting high-energy gamma flares, supernova shockwaves, and near-earth tracking matrices continuously.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Real data stream connection trigger */}
          <button
            onClick={handleToggleFeedMode}
            disabled={loadingLive}
            className={`cursor-pointer font-mono text-xs px-3.5 py-2 rounded-lg border flex items-center gap-2 transition-all ${
              isLive 
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
            }`}
            id="toggle-live-feed-btn"
          >
            {loadingLive ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isLive ? (
              <RadioTower className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            ) : (
              <Orbit className="w-3.5 h-3.5 text-gray-400" />
            )}
            <span>{isLive ? "LIVE NASA CONNECTED" : "CONNECT REAL NASA FEED"}</span>
          </button>

          <div className="bg-black p-2 px-3.5 rounded-lg border border-white/10 text-xs font-mono">
            <span className="text-gray-500 mr-2">INGEST TICKS</span>
            <span className="text-emerald-400 font-bold">{streamTicks}</span>
          </div>

          <div className="bg-pink-500/10 p-2 px-3.5 rounded-lg border border-pink-500/20 text-xs font-mono text-pink-400 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 animate-pulse" />
            <span>{activeAlertCount} METRIC ALERTS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Stream Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {events.map((evt) => {
          const isCritical = evt.alertLevel === 'CRITICAL' || evt.alertLevel === 'High';
          
          return (
            <div 
              key={evt.id} 
              className={`rounded-xl p-5 flex flex-col justify-between border transition-all relative overflow-hidden bg-black/40 ${
                isCritical 
                  ? 'border-pink-500/30 shadow-[0_0_15px_-3px_rgba(236,72,153,0.1)]' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              id={`event-card-${evt.id}`}
            >
              {/* Event Card Header */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] text-gray-500">{evt.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider font-bold ${
                    evt.alertLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-500 border border-red-500/30' :
                    evt.alertLevel === 'High' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20' :
                    evt.alertLevel === 'Medium' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {evt.alertLevel} ALERT
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 pt-2">
                  {evt.type === 'Supernova' && <Zap className="w-4 h-4 text-amber-400" />}
                  {evt.type === 'Fast Radio Burst' && <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />}
                  {evt.type === 'Gravitational Wave' && <Orbit className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />}
                  {evt.type === 'Asteroid Vector' && <ShieldAlert className="w-4 h-4 text-pink-400" />}
                  <h3 className="font-sans font-bold text-sm text-[#F5F5F7] truncate max-w-44">
                    {evt.name}
                  </h3>
                </div>
                <p className="text-[10px] text-emerald-400 font-mono">{evt.type}</p>
              </div>

              {/* Event Card Body Details */}
              <div className="py-4 space-y-2 font-sans border-t border-b border-white/5 my-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 block">SOURCE HOST:</span>
                  <span className="text-gray-300 font-medium truncate max-w-44 text-right block">{evt.source}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 block">ENERGY OUTPUT:</span>
                  <span className="text-gray-300 font-medium text-right font-mono text-[10px] block truncate max-w-44">{evt.intensity}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 block">COORDINATES RA:</span>
                  <span className="text-gray-300 font-mono text-[9px] text-right block truncate max-w-44">{evt.coordinates.split('/')[0]}</span>
                </div>
              </div>

              {/* Countdown bottom panel */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">DECAY TIME:</span>
                  <span className={`font-mono text-[11px] font-bold ${isCritical ? 'text-pink-400 animate-pulse' : 'text-emerald-400'}`}>
                    {formatCountdown(evt.timeRemainingSec)}
                  </span>
                </div>

                <button
                  onClick={() => handleScopeWarp(evt.coordinates)}
                  disabled={evt.coordinates.includes('Horizon')} 
                  className={`w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-mono text-gray-300 border border-white/10 transition-colors uppercase cursor-pointer flex justify-center items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed`}
                  id={`warp-coor-${evt.id}`}
                >
                  <Orbit className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WARP COORDINATES</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Sky Event Stream Terminal Alert logs */}
      <div className="flex-1 bg-black/60 rounded-xl border border-white/10 p-4 space-y-3 font-mono text-xs overflow-y-auto max-h-[180px] select-text">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 text-[10px] text-gray-500 justify-between">
          <span className="tracking-widest">INGEST SYSTEM LIVE TELEMETRY STREAM</span>
          <span className="text-emerald-450 text-emerald-400">ACTIVE FEED LISTENING ON PORT 3000</span>
        </div>
        {feedLogs.map((log, logIdx) => (
          <div key={logIdx} className="flex gap-4 p-1 rounded hover:bg-white/5 animate-fade-in">
            <span className="text-emerald-400 shrink-0 select-none">[{new Date().toLocaleTimeString()}]</span>
            <span className="text-gray-500 select-none">LIVE INGEST //</span>
            <span className="text-gray-300">{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

