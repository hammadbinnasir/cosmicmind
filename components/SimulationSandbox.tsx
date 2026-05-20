"use client";

import React, { useState } from 'react';
import { Sliders, Sun, ShieldCheck, Compass, HelpCircle, Activity } from 'lucide-react';

export default function SimulationSandbox() {
  // Simulator core state
  const [solarMasses, setSolarMasses] = useState<number>(10); // in standard solar masses
  const [orbitalDistanceKm, setOrbitalDistanceKm] = useState<number>(300); // orbital distance in km

  // Constants
  const G = 6.6743e-11; // Gravitational constant
  const c = 299792458; // Speed of light
  const M_sun = 1.989e30; // Mass of the sun in kg

  // Mathematical outputs
  const calculateSchwarzschildRadius = () => {
    const massKg = solarMasses * M_sun;
    const radius = (2 * G * massKg) / Math.pow(c, 2);
    return radius / 1000; // in km
  };

  const calculateEscapeVelocity = () => {
    const massKg = solarMasses * M_sun;
    const radiusMeters = orbitalDistanceKm * 1000;
    const r_s_meters = calculateSchwarzschildRadius() * 1000;

    if (radiusMeters <= r_s_meters) {
      return 299792.458; // Cap at c (Speed of light) inside the horizon!
    }

    const velocity = Math.sqrt((2 * G * massKg) / radiusMeters);
    return Math.min(c, velocity) / 1000; // in km/s
  };

  const calculateHawkingRadiationLifespan = () => {
    // Lifespan proportional to Mass^3
    // t = (5120 * pi * G^2 * M^3) / (hbar * c^4)
    // For 1 solar mass, decay time is ~2 x 10^67 years
    const baseLifespanYears = 2.098e67;
    const lifespan = Math.pow(solarMasses, 3) * baseLifespanYears;
    return lifespan;
  };

  const rs = calculateSchwarzschildRadius();
  const ev = calculateEscapeVelocity();
  const lifespan = calculateHawkingRadiationLifespan();

  // Spaghettification risk rating
  const getRiskRating = () => {
    const tidalForceRatio = solarMasses / Math.pow(orbitalDistanceKm, 3);
    if (orbitalDistanceKm <= rs) return { text: " Horizon Singularity Core Crossed", color: "text-red-500 bg-red-500/10 border-red-500/20" };
    if (tidalForceRatio > 0.01) return { text: "CRITICAL: SPAGHETTIFICATION RISK FLAGGED", color: "text-pink-400 bg-pink-500/15 border-pink-500/20 animate-pulse" };
    if (tidalForceRatio > 0.001) return { text: "WARNING: High Tidal Torque Shear", color: "text-amber-500 bg-amber-500/10 border-amber-500/10" };
    return { text: "STABLE: Tidal deflection within safety tolerances", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  };

  const risk = getRiskRating();

  return (
    <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col h-full backdrop-blur-sm shadow-2xl" id="sim-sandbox-root">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-white/10 pb-5 mb-6">
        <div>
          <h2 className="font-sans font-semibold text-lg text-white">ASTROPHYSICAL SCENARIO SIMULATOR</h2>
          <p className="text-xs text-slate-400 font-sans">Simulate spacetime curvature, accretion velocities, and event horizon Schwarzschild limits under general relativity.</p>
        </div>
        <Sun className="w-5 h-5 text-cyan-400 stroke-[1.5] hidden sm:block" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        {/* Left Parameter Inputs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Configure Curvature Parameters</h3>

            {/* Mass parameter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-sans font-medium text-gray-300 uppercase">Stellar Core Mass</label>
                <span className="font-mono text-xs text-emerald-400 font-bold">{solarMasses.toLocaleString()} Solar Masses (M☉)</span>
              </div>
              <input 
                type="range" 
                min="3" 
                max="50000" 
                step="1"
                className="w-full accent-emerald-400 h-1 bg-white/10 rounded-lg cursor-pointer"
                value={solarMasses} 
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setSolarMasses(val);
                  // Ensure orbital distance is outside Schwarzschild
                  const computedRs = (2 * G * val * M_sun) / Math.pow(c, 2) / 1000;
                  if (orbitalDistanceKm < computedRs * 1.1) {
                    setOrbitalDistanceKm(Math.ceil(computedRs * 1.5));
                  }
                }}
                id="mass-range-slider"
              />
              <div className="flex justify-between text-[9px] font-mono text-gray-600">
                <span>3 M☉ (Stellar Black Hole)</span>
                <span>50,000 M☉ (Intermediate mass Black Hole)</span>
              </div>
            </div>

            {/* Orbit Distance parameter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center w-full">
                <label className="text-xs font-sans font-medium text-gray-300 uppercase">Observer Accretion Distance</label>
                <div className="text-right">
                  <span className="font-mono text-xs text-emerald-400 font-bold">{orbitalDistanceKm.toLocaleString()} Kilometers (Km)</span>
                  <span className="block text-[8px] font-mono text-gray-500">SCHWARZSCHILD RAD: {rs.toFixed(1)} km</span>
                </div>
              </div>
              <input 
                type="range" 
                min={Math.ceil(rs * 0.8)} 
                max={Math.ceil(rs * 12)} 
                step="1"
                className="w-full accent-pink-500 h-1 bg-white/10 rounded-lg cursor-pointer"
                value={orbitalDistanceKm} 
                onChange={(e) => setOrbitalDistanceKm(parseInt(e.target.value))}
                id="distance-range-slider"
              />
              <div className="flex justify-between text-[9px] font-mono text-gray-600">
                <span>{Math.ceil(rs * 0.8).toLocaleString()} km (Horizon edge)</span>
                <span>{Math.ceil(rs * 12).toLocaleString()} km (Stable safety zone)</span>
              </div>
            </div>

            {/* Physical State Status Alert */}
            <div className={`p-4 rounded-xl border text-xs font-sans font-semibold flex items-start gap-2.5 ${risk.color}`}>
              <HelpCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <span>{risk.text}</span>
                <span className="block text-[10px] text-gray-400 mt-1 font-normal font-sans">
                  Tidal stress ratio calculated at: {(solarMasses / Math.pow(orbitalDistanceKm, 3) * 1000).toFixed(4)} N/kg. Accretion temperature is: {(solarMasses * 1e7 / orbitalDistanceKm).toLocaleString(undefined, {maximumFractionDigits:0})} Kelvin.
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-gray-500 p-3 bg-black/40 rounded-lg border border-white/5 uppercase">
            * Calculations implement Keplerian speeds adjusted with early Schwarzschild spacetime metrics.
          </div>
        </div>

        {/* Right Output Calculations Visualization (7 cols) */}
        <div className="lg:col-span-7 bg-black/40 rounded-xl border border-white/10 p-5 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">MATHEMATICAL RELATIVITY OBSERVATIONS</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Radius output */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold mb-1">SCHWARZSCHILD RADIUS</span>
                  <span className="text-xl font-bold font-mono text-[#F5F5F7] tracking-tight">{rs.toLocaleString(undefined, {maximumFractionDigits: 2})} Km</span>
                </div>
                <div className="text-[9px] font-mono text-gray-400 mt-3 border-t border-white/5 pt-2">
                  Equation: Rs = 2GM / c²
                  <span className="block text-gray-500 mt-1">Observer boundary of absolute collapse.</span>
                </div>
              </div>

              {/* Escape Velocity output */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-pink-400 uppercase tracking-widest block font-bold mb-1">ESCAPE VELOCITY V E</span>
                  <span className="text-xl font-bold font-mono text-[#F5F5F7] tracking-tight">
                    {ev >= 299792.4 ? "299,792.4 Km/s (Speed of Light C)" : `${ev.toLocaleString(undefined, {maximumFractionDigits:1})} Km/s`}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-gray-400 mt-3 border-t border-white/5 pt-2">
                  Equation: Ve = √(2GM / R)
                  <span className="block text-gray-500 mt-1">Light waves cannot escape when Ve &gt;= c.</span>
                </div>
              </div>

              {/* Orbital Speed */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold mb-1">KEPLERIAN ORBITAL SPEED</span>
                  <span className="text-xl font-bold font-mono text-[#F5F5F7] tracking-tight">
                    {orbitalDistanceKm <= rs ? "N/A (Accretion Disc Collapsed)" : `${(ev / Math.sqrt(2)).toLocaleString(undefined, {maximumFractionDigits:1})} Km/s`}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-gray-400 mt-3 border-t border-white/5 pt-2">
                  Equation: Vo = √(GM / R)
                  <span className="block text-gray-500 mt-1">Mean stable speed of accretion ring gas.</span>
                </div>
              </div>

              {/* Hawking life */}
              <div className="bg-white/5 border border-white/10 p-4 rounded-lg flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest block font-bold mb-1">HAWKING DECAY LIFESPAN</span>
                  <span className="text-xl font-bold font-mono text-[#F5F5F7] tracking-tight">
                    {lifespan >= 1e100 ? "Stable (Approaching Infinite Epochs)" : `~${lifespan.toExponential(2)} Years`}
                  </span>
                </div>
                <div className="text-[9px] font-mono text-gray-400 mt-3 border-t border-white/5 pt-2">
                  Equation: τ ∝ M³ years
                  <span className="block text-gray-500 mt-1">Evaporation lifespan via quantum Hawking flux.</span>
                </div>
              </div>
            </div>

            {/* Visual simulation representation - Spacetime curvature mapping */}
            <div className="space-y-2 pt-3 border-t border-white/5">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Spacetime curvature deflection grid:</span>
              <div className="h-20 bg-black/60 rounded border border-white/5 relative overflow-hidden flex items-center justify-center">
                {/* Horizontal reference lines warped in the center */}
                <svg className="w-full h-full stroke-emerald-500/20" xmlns="http://www.w3.org/2000/svg">
                  <path d={`M 0 40 Q 150 ${40 + (solarMasses / orbitalDistanceKm) * 50} 300 ${40 + (solarMasses / orbitalDistanceKm) * 50} Q 450 ${40 + (solarMasses / orbitalDistanceKm) * 50} 600 40`} strokeWidth="1" fill="none" />
                  <path d={`M 0 20 Q 150 ${20 + (solarMasses / orbitalDistanceKm) * 35} 300 ${20 + (solarMasses / orbitalDistanceKm) * 35} Q 450 ${20 + (solarMasses / orbitalDistanceKm) * 35} 600 20`} strokeWidth="1" fill="none" />
                  <path d={`M 0 60 Q 150 ${60 + (solarMasses / orbitalDistanceKm) * 35} 300 ${60 + (solarMasses / orbitalDistanceKm) * 35} Q 450 ${60 + (solarMasses / orbitalDistanceKm) * 35} 600 60`} strokeWidth="1" fill="none" />
                  {/* Singularity circle core in the center */}
                  <circle cx="280" cy="50" r={Math.min(30, Math.max(2, rs * 0.15))} fill="url(#singularityGradient)" />
                  <defs>
                    <radialGradient id="singularityGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="1" />
                    </radialGradient>
                  </defs>
                </svg>
                <div className="absolute top-2 right-4 font-mono text-[8px] text-pink-400 uppercase">
                  GRAVITY WELL DEFLECTION: {(solarMasses / orbitalDistanceKm).toFixed(4)}λ
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-6">
            <span className="text-[8px] font-mono text-gray-600">STABILITY RATIO: {(1 / (solarMasses / orbitalDistanceKm)).toFixed(4)} (SAFE &gt; 100)</span>
            <button
              onClick={() => alert("Simulation snapshot compiled to observatory ledger.")}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-mono border border-emerald-500/20 rounded uppercase transition-all"
              id="save-sim-snapshot"
            >
              SAVE SIMULATION METRIC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
