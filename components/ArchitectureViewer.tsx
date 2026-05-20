"use client";

import React, { useState } from 'react';
import { 
  SYSTEM_DATABASE_SCHEMAS, 
  API_SPECIFICATIONS, 
  SUGGESTED_AI_MODELS, 
  SYSTEM_WORKFLOW_STEPS 
} from '@/lib/mockData';
import { 
  Layers, 
  Database, 
  Code, 
  Sliders, 
  CheckCircle, 
  Lightbulb, 
  Workflow, 
  Cpu, 
  History, 
  GitBranch, 
  Eye, 
  Activity, 
  Terminal,
  ShieldCheck,
  Zap,
  Network
} from 'lucide-react';

export default function ArchitectureViewer() {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'orchestration' | 'schemas' | 'observability' | 'roadmap'>('blueprint');
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<string>("galaxies");

  const currentSchema = SYSTEM_DATABASE_SCHEMAS.find(s => s.table === selectedSchemaTable) || SYSTEM_DATABASE_SCHEMAS[0];

  const renderBlueprint = () => {
    return (
      <div className="space-y-6 animate-fade-in" id="archi-blueprint-tab">
        {/* Core Architecture Topology Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/45 border border-white/10 p-5 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">I. DATA INGESTION NODES</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Continuous live integration with SDSS catalogs, NASA Exoplanet archival streams, Gaia astrometric clusters, and real-time raw FITS metadata processing via web workers.
            </p>
          </div>
          <div className="bg-black/45 border border-white/10 p-5 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">II. NEURAL ORCHESTRATOR</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Routes workflows dynamically. Triggers schema-based classification through <code className="text-emerald-400 text-[10px] font-mono">gemini-3.5-flash</code> with fallback pipelines, and computes confidence scores.
            </p>
          </div>
          <div className="bg-black/45 border border-white/10 p-5 rounded-2xl space-y-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
              <span className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">III. OBSERVATION HUB HUD</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Cinematic client-side React + Tailwind environment. Maps galaxy vectors using HTML5 canvas, manages saved coordinates, and renders diagnostic metrics instantly.
            </p>
          </div>
        </div>

        {/* Directory Layout Structure */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-zinc-400 font-mono text-xs">
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase tracking-widest pl-1 font-bold">PROPOSED PRODUCTION REPOSITORY HYDRA-TREE</span>
          </div>
          <pre className="bg-black/70 rounded-2xl border border-white/10 p-5 font-mono text-[10px] text-gray-300 overflow-x-auto leading-relaxed max-h-64 select-all">
{`cosmicmind-astro-platform/
├── app/
│   ├── api/
│   │   ├── gemini/
│   │   │   ├── chat/route.ts        # Q&A NLP Orchestrator API
│   │   │   ├── analyze/route.ts     # Multi-Spectral JSON Classifier
│   │   │   └── summarize/route.ts   # Academic Citation Embedder
│   │   └── observability/
│   │       └── tracer/route.ts      # OpenTelemetry Trace Exporter Endpoint
│   ├── globals.css                  # Custom Tailwind & Glassmorphism variables
│   ├── layout.tsx                   # Font pairing optimization
│   └── page.tsx                     # Landing & workspace components assembler
├── components/
│   ├── ArchitectureViewer.tsx       # Live interactive systems specification core
│   ├── CosmicChat.tsx               # Chat assistant + active telemetry traces panel
│   ├── EventDashboard.tsx           # Supernovae & transient monitoring triggers
│   ├── GalaxyAnalyzer.tsx           # Multi-band drop-zone with live pipeline logs
│   └── GalaxyMap.tsx                # Star-node projection 3D canvas engine
├── lib/
│   ├── AIOrchestrator.ts            # Enterprise model routing, metrics, retries
│   ├── gemini.ts                    # Safe server-side GenAI SDK configurations
│   ├── mockData.ts                  # Raw SQL schemas, API definitions, datasets
│   └── utils.ts                     # Coordinates delta math utilities
├── terraform/                       # Infrastructure-as-code deployment layers
│   ├── main.tf                      # Cloud Run, Cloud SQL PostgreSQL schema
│   └── variables.tf                 # Regional L3 node mappings
└── package.json                     # Animation/Three.js dependency tree`}
          </pre>
        </div>
      </div>
    );
  };

  const renderOrchestration = () => {
    return (
      <div className="space-y-5 animate-fade-in" id="archi-orchestration-tab">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div>
            <h3 className="font-mono text-xs text-[#F5F5F7] font-bold uppercase tracking-widest">Autonomous AI Orchestrator Pipeline Design</h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Automates task routing, model fallbacks, retry parameters, and confidence metrics matching scientific accuracy.</p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-mono uppercase tracking-widest">
            MODEL_LINK: GEMINI-3.5-FLASH
          </span>
        </div>

        {/* Suggested Model Mappings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUGGESTED_AI_MODELS.map((model, idx) => (
            <div key={idx} className="bg-black/40 border border-white/5 p-4 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-mono text-pink-400 block mb-1 uppercase tracking-wider">{model.task}</span>
                <h4 className="font-sans font-bold text-xs text-[#F5F5F7] mb-1.5">{model.model}</h4>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed border-t border-white/5 pt-2 mt-2 italic">
                &ldquo;{model.reason}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Workflow Pipeline */}
        <div className="space-y-3 bg-black/60 rounded-2xl border border-white/10 p-5">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">TRANSIENT CO-ADD CORRELATION PIPELINE FLOW</span>
          <div className="space-y-3">
            {SYSTEM_WORKFLOW_STEPS.map((step, idx) => (
              <div key={idx} className="flex gap-4 text-xs font-sans items-start">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0">{idx + 1}</span>
                <div className="space-y-0.5">
                  <h5 className="font-sans font-extrabold text-[#F5F5F7]">{step.step}</h5>
                  <p className="text-slate-400 leading-normal">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSchemas = () => {
    return (
      <div className="space-y-5 animate-fade-in" id="archi-schemas-tab">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-mono text-xs text-[#F5F5F7] font-bold uppercase tracking-widest">Enterprise PostgreSQL + Vector Search Relational Schema</h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Optimized relational definition layouts, Partition strategies, and pgvector embeddings schema configuration.</p>
          </div>

          <div className="flex flex-wrap gap-1.5 shrink-0">
            {SYSTEM_DATABASE_SCHEMAS.map(s => (
              <button
                key={s.table}
                onClick={() => setSelectedSchemaTable(s.table)}
                className={`p-1.5 px-3 text-[10px] font-mono border rounded-lg transition-all ${
                  selectedSchemaTable === s.table
                    ? 'bg-emerald-500/15 border-emerald-500/25 text-[#F5F5F7] font-bold'
                    : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-white'
                }`}
                id={`schema-btn-${s.table}`}
              >
                {s.table.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Database table previewer card */}
        <div className="bg-black/60 rounded-2xl border border-white/10 p-5 space-y-4">
          <div className="border-b border-white/5 pb-3">
            <h4 className="font-mono text-xs text-emerald-400 font-extrabold uppercase mb-1">TABLE RELATION INDEX</h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">{currentSchema.description}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-gray-500 uppercase block tracking-widest">PRODUCTION METRIC TABLE CONTEXT DEFINITION:</span>
            <pre className="bg-black p-4 rounded-xl border border-white/5 text-[10px] text-emerald-400 font-mono overflow-auto select-all max-h-80 leading-relaxed">
              {currentSchema.sql}
            </pre>
          </div>
        </div>

        {/* Additional Enterprise database specifications */}
        <div className="bg-white/5 border border-white/5 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">1. Partitioning Strategy</span>
            <p className="text-[#a0aec0] leading-relaxed">
              Telescope raw streams and event counts partitions on historical epochs (months). Old partitions auto-replicate to cold-storage S3 buckets, ensuring query speeds below 30ms on production.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block font-bold">2. HNSW Semantic Retrieval Indexing</span>
            <p className="text-[#a0aec0] leading-relaxed">
              Employs an HNSW index on `astronomy_vector_embeddings` with cosine distance calculations. Allows the Gemini context loader to query over 1,000 parallel research nodes within milliseconds.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderObservability = () => {
    return (
      <div className="space-y-5 animate-fade-in" id="archi-observability-tab">
        <div className="border-b border-white/10 pb-3">
          <h3 className="font-mono text-xs text-[#F5F5F7] font-bold uppercase tracking-widest">Institutional-Grade Observability & Tracing Infrastructure</h3>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">Integrates OpenTelemetry trace configurations, model latency metrics, and real-time incident diagnostics routing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 text-xs">
            <span className="text-pink-400 font-mono text-[10px] uppercase font-bold tracking-widest block">I. INFERENCE METRICS</span>
            <span className="block text-white font-bold text-sm">99.8% Core Accuracy</span>
            <p className="text-slate-400 font-sans leading-normal text-[11px]">Tracks token footprints, semantic drift indices, and coordinates accuracy metrics across all live deep-space inquiries.</p>
          </div>
          <div className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 text-xs">
            <span className="text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-widest block">II. OPEN TELEMETRY SPANS</span>
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>TRACING INGESTS SPANS</span>
            </div>
            <p className="text-slate-400 font-sans leading-normal text-[11px]">Telemetry pipelines trace observations from ingress sockets down to vector similarity database hits and outputs generation.</p>
          </div>
          <div className="bg-black/45 border border-white/5 p-4 rounded-xl space-y-2 text-xs">
            <span className="text-yellow-450 text-yellow-500 font-mono text-[10px] uppercase font-bold tracking-widest block">III. INCIDENT MANAGEMENT</span>
            <span className="block text-white font-bold text-sm">0 SLA Violations</span>
            <p className="text-slate-400 font-sans leading-normal text-[11px]">Auto-alerts trigger fallback pipelines if an input fails validation checks or exceeds model latency standards of 1500ms.</p>
          </div>
        </div>

        {/* Cloud Infrastructure Map Spec */}
        <div className="bg-black/60 rounded-2xl border border-white/10 p-5 space-y-3">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Cloud Infrastructure Specifications (Terraform)</span>
          <pre className="bg-black/90 p-4 rounded-xl border border-white/5 text-[9px] text-[#A0AEC0] font-mono overflow-auto max-h-56 leading-relaxed select-all">
{`# cloud_run_observatory_gateway.tf
resource "google_cloud_run_v2_service" "observatory_core" {
  name     = "cosmicmind-observatory-gateway"
  location = "us-central1"

  template {
    containers {
      image = "gcr.io/cosmicmind-astro-platform/core-pipeline:v1.4.0"
      
      resources {
        limits = {
          cpu    = "4000m"
          memory = "8Gi"
        }
      }
      
      env {
        name  = "OTEL_EXPORTER_OTLP_ENDPOINT"
        value = "https://tracing.cloud.nasa-observatory.internal:4317"
      }
      env {
        name  = "VECTOR_STORE_CONNECTION_STRING"
        value = "postgresql://vector-ingress:secured@db.internal:5432/vectors"
      }
    }
  }
}`}
          </pre>
        </div>
      </div>
    );
  };

  const renderRoadmap = () => {
    return (
      <div className="space-y-6 animate-fade-in" id="archi-roadmap-tab">
        <div className="border-b border-white/10 pb-3">
          <h3 className="font-mono text-xs text-[#F5F5F7] font-bold uppercase tracking-widest">Future Autonomous Discovery & Commercialization Roadmap</h3>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">Key milestones detailing future robotic targeting drive connections, localized predictions, and organizational scaling.</p>
        </div>

        <div className="relative border-l border-white/10 pl-5 ml-2.5 pb-2 space-y-8">
          {/* Timeline Item 1 */}
          <div className="relative">
            <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-cyan-400 animate-pulse border border-black" />
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded font-bold">PHASE 1 - AUTONOMOUS RE-POSTULATING TIMELINE (Q3 2026)</span>
              <h4 className="text-xs text-white uppercase font-bold font-sans">Robotic Telescope ASCOM Driver Integration</h4>
              <p className="text-xs text-slate-400 font-sans leading-normal">
                Establish bidirectional communication coordinates with ground telescopes. When CosmicMind AI flags an anomaly score exceeding 85%, the backend auto-compiles orbital Keplerian parameters and streams them directly to coordinate drivers to trigger narrow-field focus sweeps.
              </p>
            </div>
          </div>

          {/* Timeline Item 2 */}
          <div className="relative">
            <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-emerald-400 border border-black" />
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">PHASE 2 - ADVANCED SYSTEM INTELLIGENCE (Q1 2027)</span>
              <h4 className="text-xs text-white uppercase font-bold font-sans">Distributed Event Transient Prediction Networks</h4>
              <p className="text-xs text-slate-400 font-sans leading-normal">
                Deploy continuous predictive temporal algorithms targeting magnetic collapses. Pre-determines coordinates where supernovae are highly likely to erupt within 48 hours, enabling astrophotonics instrumentation setups prior to initial shock flare.
              </p>
            </div>
          </div>

          {/* Timeline Item 3 */}
          <div className="relative">
            <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-violet-400 border border-black" />
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded font-bold">PHASE 3 - ENTERPRISE OPERATIONS & GLOBAL COMMERCIALIZATION (Q3 2027)</span>
              <h4 className="text-xs text-white uppercase font-bold font-sans">Global Astronomical Cloud Federated Networks</h4>
              <p className="text-xs text-slate-400 font-sans leading-normal">
                Incorporate Clerk organizational workspace parameters and dedicated billing pipelines. Commercial research laboratories, space ventures, and university consortia can spin up regional collaborative workspaces with dedicated observatory access keys effortlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex flex-col h-full backdrop-blur-sm shadow-2xl" id="architecture-viewer-root">
      {/* Header and top tab selectors */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b border-white/10 pb-5 mb-6">
        <div>
          <h2 className="font-sans font-semibold text-lg text-white">COSMICMIND SYSTEMS ARCHITECT HUD SPECIFICATIONS</h2>
          <p className="text-xs text-slate-400 font-sans">Advanced enterprise-grade topology, relational PostgreSQL with pgvector schema layouts, OpenTelemetry spans, and commercial timelines.</p>
        </div>

        {/* Tab triggers */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {[
            { id: 'blueprint', label: 'SYSTEM BLUEPRINT', icon: Layers },
            { id: 'orchestration', label: 'AI ORCHESTRATOR', icon: Cpu },
            { id: 'schemas', label: 'POSTGRES ERD', icon: Database },
            { id: 'observability', label: 'OBSERVABILITY & ARCH', icon: Eye },
            { id: 'roadmap', label: 'FUTURE COMMERCIAL ROADMAP', icon: Sliders }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 p-2 px-3.5 rounded-lg border text-[10px] font-mono tracking-wide transition-all ${
                  isActive 
                    ? 'bg-emerald-500 text-black border-transparent font-bold hover:bg-emerald-400' 
                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'
                }`}
                id={`tab-blueprint-trigger-${tab.id}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Tab Body rendering */}
      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {activeTab === 'blueprint' && renderBlueprint()}
        {activeTab === 'orchestration' && renderOrchestration()}
        {activeTab === 'schemas' && renderSchemas()}
        {activeTab === 'observability' && renderObservability()}
        {activeTab === 'roadmap' && renderRoadmap()}
      </div>
    </div>
  );
}
