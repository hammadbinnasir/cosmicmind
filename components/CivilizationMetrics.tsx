"use client";

import React from 'react';
import { 
  RefreshCw, 
  MessageSquare, 
  Search, 
  Network, 
  ShieldAlert, 
  TrendingUp 
} from 'lucide-react';

interface CivilizationMetricsProps {
  cyclesCompleted: number;
  activeDebates: number;
  gapsDetected: number;
  graphNodes: number;
  failedTheories: number;
  avgConfidence: number;
}

export function CivilizationMetrics({
  cyclesCompleted,
  activeDebates,
  gapsDetected,
  graphNodes,
  failedTheories,
  avgConfidence
}: CivilizationMetricsProps) {
  const metrics = [
    { icon: RefreshCw, label: 'CYCLES', value: cyclesCompleted, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { icon: MessageSquare, label: 'DEBATES', value: activeDebates, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { icon: Search, label: 'GAPS', value: gapsDetected, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { icon: Network, label: 'GRAPH NODES', value: graphNodes, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: ShieldAlert, label: 'REFUTED', value: failedTheories, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { icon: TrendingUp, label: 'AVG CONFIDENCE', value: avgConfidence, unit: '%', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#090A10]">
      {/* Shimmer border animation */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
        <div 
          className="absolute -inset-[1px] rounded-2xl opacity-30"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.3) 25%, rgba(99,102,241,0.3) 50%, rgba(236,72,153,0.3) 75%, transparent 100%)',
            backgroundSize: '300% 100%',
            animation: 'shimmerBorder 4s linear infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes shimmerBorder {
          0% { background-position: 300% 0; }
          100% { background-position: -300% 0; }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .metric-value {
          animation: countUp 0.6s ease-out forwards;
        }
      `}</style>

      <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-white/5">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div 
              key={m.label} 
              className="bg-[#090A10] p-3.5 flex items-center gap-3 group hover:bg-white/5 transition-colors"
            >
              <div className={`w-8 h-8 ${m.bg} border ${m.border} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>
              <div className="min-w-0">
                <span className="block text-[7px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">{m.label}</span>
                <span 
                  className="metric-value block text-white font-bold text-sm font-mono leading-none"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {m.value}{m.unit || ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
