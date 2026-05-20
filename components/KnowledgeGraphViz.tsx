"use client";

import React, { useState, useMemo } from 'react';
import { UniverseNode } from '@/lib/agents/RecursiveReasoningEngine';

interface KnowledgeGraphVizProps {
  nodes: UniverseNode[];
  onNodeSelect?: (node: UniverseNode) => void;
}

const NODE_COLORS: Record<string, { fill: string; stroke: string; glow: string; label: string }> = {
  blackhole:          { fill: '#7c3aed', stroke: '#a78bfa', glow: 'rgba(124,58,237,0.4)', label: 'Black Hole' },
  anomaly:            { fill: '#ec4899', stroke: '#f472b6', glow: 'rgba(236,72,153,0.4)', label: 'Anomaly' },
  galaxy:             { fill: '#06b6d4', stroke: '#67e8f9', glow: 'rgba(6,182,212,0.4)',   label: 'Galaxy' },
  dark_matter_filament: { fill: '#10b981', stroke: '#6ee7b7', glow: 'rgba(16,185,129,0.4)', label: 'Dark Matter Filament' },
  quasar:             { fill: '#f59e0b', stroke: '#fbbf24', glow: 'rgba(245,158,11,0.4)',  label: 'Quasar' },
  cosmic_string:      { fill: '#6366f1', stroke: '#818cf8', glow: 'rgba(99,102,241,0.4)',  label: 'Cosmic String' },
};

function getNodeColor(type: string) {
  return NODE_COLORS[type] || NODE_COLORS['galaxy'];
}

export default function KnowledgeGraphViz({ nodes, onNodeSelect }: KnowledgeGraphVizProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Deterministic layout: spread nodes in elliptical arcs
  const layout = useMemo(() => {
    const cx = 400, cy = 250;
    const rx = 280, ry = 160;
    return nodes.map((node, i) => {
      const angle = (i / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
      // Add layered offset for visual depth
      const layer = i % 3;
      const layerScale = 1 - layer * 0.25;
      const jitterX = ((i * 137) % 60) - 30;
      const jitterY = ((i * 97) % 40) - 20;
      return {
        ...node,
        x: cx + Math.cos(angle) * rx * layerScale + jitterX,
        y: cy + Math.sin(angle) * ry * layerScale + jitterY,
      };
    });
  }, [nodes]);

  // Build edge lookup from causalOutflowConnections
  const edges = useMemo(() => {
    const result: { x1: number; y1: number; x2: number; y2: number; sourceId: string; targetId: string }[] = [];
    const posMap = new Map(layout.map(n => [n.id, { x: n.x, y: n.y }]));
    layout.forEach(n => {
      n.causalOutflowConnections.forEach(targetId => {
        const target = posMap.get(targetId);
        if (target) {
          result.push({ x1: n.x, y1: n.y, x2: target.x, y2: target.y, sourceId: n.id, targetId });
        }
      });
      // Also draw temporal predecessor links
      n.temporalPredecessors.forEach(predId => {
        const pred = posMap.get(predId);
        if (pred) {
          result.push({ x1: pred.x, y1: pred.y, x2: n.x, y2: n.y, sourceId: predId, targetId: n.id });
        }
      });
    });
    return result;
  }, [layout]);

  const handleClick = (node: UniverseNode) => {
    setSelectedId(node.id === selectedId ? null : node.id);
    onNodeSelect?.(node);
  };

  const hoveredNode = layout.find(n => n.id === hoveredId);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ background: '#050507' }}>
      {/* Radial center glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.06) 0%, transparent 70%)'
      }} />

      <svg viewBox="0 0 800 500" className="w-full h-auto" style={{ minHeight: '320px' }}>
        <defs>
          {/* Animated dash for edges */}
          <style>{`
            @keyframes dashFlow {
              to { stroke-dashoffset: -24; }
            }
            @keyframes pulseNode {
              0%, 100% { r: 10; opacity: 0.6; }
              50% { r: 14; opacity: 0.3; }
            }
            .edge-line {
              stroke-dasharray: 6 6;
              animation: dashFlow 2s linear infinite;
            }
            .pulse-ring {
              animation: pulseNode 2s ease-in-out infinite;
            }
          `}</style>

          {/* Glow filters for each type */}
          {Object.entries(NODE_COLORS).map(([type, colors]) => (
            <filter key={type} id={`glow-${type}`} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={colors.glow} floodOpacity="0.8" />
            </filter>
          ))}

          {/* Selected ring glow */}
          <filter id="glow-selected" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="rgba(6,182,212,0.8)" floodOpacity="1" />
          </filter>
        </defs>

        {/* Grid lines for depth */}
        {[...Array(5)].map((_, i) => (
          <ellipse
            key={`grid-${i}`}
            cx="400" cy="250"
            rx={80 + i * 60} ry={40 + i * 35}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
        ))}

        {/* Edges */}
        {edges.map((e, i) => (
          <line
            key={`edge-${i}`}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="rgba(6,182,212,0.15)"
            strokeWidth="1"
            className="edge-line"
          />
        ))}

        {/* Nodes */}
        {layout.map(node => {
          const colors = getNodeColor(node.type);
          const isHovered = hoveredId === node.id;
          const isSelected = selectedId === node.id;
          const isHighAnomaly = node.anomalyScore > 85;
          const radius = isHovered ? 10 : isSelected ? 9 : 7;

          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleClick(node)}
            >
              {/* Anomaly pulse ring */}
              {isHighAnomaly && (
                <circle
                  cx={node.x} cy={node.y}
                  fill="none"
                  stroke={colors.stroke}
                  strokeWidth="1"
                  opacity="0.4"
                  className="pulse-ring"
                  r="10"
                />
              )}

              {/* Selected outer ring */}
              {isSelected && (
                <circle
                  cx={node.x} cy={node.y} r={14}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  opacity="0.6"
                  filter="url(#glow-selected)"
                />
              )}

              {/* Main node circle */}
              <circle
                cx={node.x} cy={node.y} r={radius}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={isHovered || isSelected ? 2 : 1}
                filter={`url(#glow-${node.type})`}
                style={{ transition: 'r 0.2s ease, stroke-width 0.2s ease' }}
              />

              {/* Small label underneath for selected/hovered */}
              {(isHovered || isSelected) && (
                <text
                  x={node.x} y={node.y + 18}
                  textAnchor="middle"
                  fill="white"
                  fontSize="7"
                  fontFamily="monospace"
                  opacity="0.8"
                >
                  {node.label.length > 28 ? node.label.slice(0, 28) + '…' : node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none bg-black/90 border border-white/10 backdrop-blur-md rounded-xl p-3 text-[9px] font-mono space-y-1 shadow-2xl z-10"
          style={{
            left: `${Math.min(Math.max((hoveredNode.x / 800) * 100, 15), 75)}%`,
            top: `${Math.min(Math.max((hoveredNode.y / 500) * 100 - 18, 5), 70)}%`,
            transform: 'translateX(-50%)',
            minWidth: '180px'
          }}
        >
          <div className="text-white font-bold text-[10px]">{hoveredNode.label}</div>
          <div className="text-gray-500 uppercase tracking-wider">{hoveredNode.type.replace(/_/g, ' ')}</div>
          <div className="flex justify-between pt-1 border-t border-white/10">
            <span className="text-gray-500">ANOMALY</span>
            <span className={`font-bold ${hoveredNode.anomalyScore > 85 ? 'text-pink-400' : 'text-cyan-400'}`}>{hoveredNode.anomalyScore}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">COORD</span>
            <span className="text-zinc-300">{hoveredNode.coordinates.ra}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
        {Object.entries(NODE_COLORS).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5 bg-black/60 border border-white/5 px-2 py-1 rounded-lg">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.fill }} />
            <span className="text-[7px] font-mono text-gray-500 uppercase">{colors.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
