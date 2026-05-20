// Multi-band mock dataset and system architecture declarations for CosmicMind

// --- Interactive Star / Galaxy Nodes ---
export interface Galaxy {
  id: string;
  name: string;
  type: 'Spiral' | 'Elliptical' | 'Lenticular' | 'Irregular' | 'Active Galactic Nucleus (AGN)' | 'Unknown Anomaly';
  constellation: string;
  distance: string; // in Million Light Years (Mly)
  ra: string; // Right Ascension (H:M:S)
  dec: string; // Declination (D:M:S)
  redshift: number;
  anomalyScore: number; // 0 - 100%
  status: 'Stable' | 'Critical Anomaly' | 'Unusual Gamma Flare' | 'Binary Star Dissolution';
  spectralData: number[]; // wavelength readings for interactive charts
  description: string;
  color: string; // CSS neon color
  coordinates: { x: number; y: number; z: number }; // 3D coordinates
}

export const GALAXIES: Galaxy[] = [
  {
    id: "gal-001",
    name: "Messier 87 Core",
    type: "Active Galactic Nucleus (AGN)",
    constellation: "Virgo",
    distance: "53.5 Mly",
    ra: "12h 30m 49.4s",
    dec: "+12° 20′ 13″",
    redshift: 0.00428,
    anomalyScore: 84,
    status: "Unusual Gamma Flare",
    spectralData: [45, 62, 110, 185, 230, 310, 290, 420, 580, 920, 810, 450],
    description: "Home of the famous supermassive black hole M87*. Observation logs indicate a sudden high-energy plasma jet acceleration, emitting excessive TeV-range gamma-radiation across the relativistic jet cone.",
    color: "#ec4899", // Neon Pink/Crimson
    coordinates: { x: 120, y: -40, z: 80 }
  },
  {
    id: "gal-002",
    name: "Andromeda Helix (M31)",
    type: "Spiral",
    constellation: "Andromeda",
    distance: "2.5 Mly",
    ra: "00h 42m 44.3s",
    dec: "+41° 16′ 09″",
    redshift: -0.00100, // Blueshifted!
    anomalyScore: 4,
    status: "Stable",
    spectralData: [150, 190, 240, 260, 280, 290, 310, 320, 300, 270, 220, 140],
    description: "Standard spiral galaxy system in collision trajectories with the Milky Way. Neural multi-band scan reveals no dangerous magnetic anomalies; halo gas is steady and standard stellar orbits remain stable.",
    color: "#3b82f6", // Electric Blue
    coordinates: { x: -80, y: 110, z: -30 }
  },
  {
    id: "gal-003",
    name: "A1689-zD1 Lensed Arc",
    type: "Unknown Anomaly",
    constellation: "Virgo",
    distance: "12,800 Mly",
    ra: "13h 11m 29.9s",
    dec: "-01° 20′ 17″",
    redshift: 7.60000, // Highly Redshifted
    anomalyScore: 97,
    status: "Critical Anomaly",
    spectralData: [12, 18, 25, 34, 45, 80, 150, 310, 680, 1050, 1420, 1890],
    description: "Highly warped deep space gravitational lens source. Multi-spectral sensors flagged a gravitational wave ripple co-aligned with a dark matter micro-lensing spike, indicating early cosmic structure collapse.",
    color: "#a855f7", // Purple Neon
    coordinates: { x: 40, y: 60, z: 210 }
  },
  {
    id: "gal-004",
    name: "NGC 1068 (Messier 77)",
    type: "Lenticular",
    constellation: "Cetus",
    distance: "47 Mly",
    ra: "02h 42m 40.7s",
    dec: "-00° 00′ 48″",
    redshift: 0.00379,
    anomalyScore: 32,
    status: "Stable",
    spectralData: [90, 110, 130, 150, 145, 135, 140, 160, 180, 210, 190, 130],
    description: "Classic Seyfert II active nucleus galaxy. High concentration of energetic dust rings found around the core. Radio emissions display mild flux variances suggesting regular accretion disc turbulence.",
    color: "#10b981", // Emerald Accent
    coordinates: { x: -140, y: -90, z: 60 }
  },
  {
    id: "gal-005",
    name: "Cartwheel Ring (PGC 2248)",
    type: "Irregular",
    constellation: "Sculptor",
    distance: "500 Mly",
    ra: "00h 37m 41.1s",
    dec: "-33° 42′ 58″",
    redshift: 0.03030,
    anomalyScore: 61,
    status: "Binary Star Dissolution",
    spectralData: [30, 50, 80, 120, 200, 340, 480, 520, 480, 350, 240, 110],
    description: "Result of an ancient cosmic collision. Dynamic stellar density calculations indicate high shockwave triggers pushing stellar gas outwards in a neon ring structure, generating micro-supernovae fields.",
    color: "#f59e0b", // Neon Amber
    coordinates: { x: 200, y: 150, z: -100 }
  }
];

// --- Realtime Event Monitoring ---
export interface CosmicEvent {
  id: string;
  name: string;
  type: 'Supernova' | 'Fast Radio Burst' | 'Gravitational Wave' | 'Asteroid Vector';
  source: string;
  intensity: string;
  alertLevel: 'Low' | 'Medium' | 'High' | 'CRITICAL';
  coordinates: string;
  timestamp: string;
  timeRemainingSec?: number; // Countdown tickers simulation
}

export const COSMIC_EVENTS: CosmicEvent[] = [
  {
    id: "evt-901",
    name: "SN-2026_V1A",
    type: "Supernova",
    source: "Centaurus A Core Offset",
    intensity: "9.4 x 10^44 Watts",
    alertLevel: "High",
    coordinates: "RA 13h25m27.6s / DEC -43°01'09\"",
    timestamp: "Received: T-minus 12 minutes ago",
    timeRemainingSec: 3420
  },
  {
    id: "evt-902",
    name: "FRB-810992-ZX",
    type: "Fast Radio Burst",
    source: "Unresolved Magnetar Core",
    intensity: "870 Jansky-ms",
    alertLevel: "Low",
    coordinates: "RA 04h11m12.4s / DEC +15°24'02\"",
    timestamp: "Received: T-minus 4 minutes ago",
    timeRemainingSec: 120
  },
  {
    id: "evt-903",
    name: "GW-260520-CHIRP",
    type: "Gravitational Wave",
    source: "Dual Binary Stellar Mass Black Hole Inspiral",
    intensity: "3.4 Solar Masses Converted to Curvature",
    alertLevel: "CRITICAL",
    coordinates: "Cosmic Horizon (Isotropic Ellipsoid)",
    timestamp: "T-minus 32 seconds ago",
    timeRemainingSec: 45
  },
  {
    id: "evt-904",
    name: "NEO-2026_XS4",
    type: "Asteroid Vector",
    source: "Kuiper belt eccentric trajectory passing Earth orbit",
    intensity: "Diameter: ~340m / Relative Velocity: 34 km/s",
    alertLevel: "Medium",
    coordinates: "RA 21h04m / DEC -04°55'",
    timestamp: "Tracking continuously",
    timeRemainingSec: 72400
  }
];

// --- Astronomy Research Papers presets for summarization ---
export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  journal: string;
  doi: string;
  abstract: string;
  citations: string[];
  findings: string[];
}

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: "paper-01",
    title: "A 100 TeV Gamma-Ray Flare in Active Nucleus Galaxies via Relativistic Jet Shock Collisions",
    authors: "Dr. Elena Rostov, Prof. Keith Vance, Dr. Liam O'Connor",
    journal: "The Astrophysical Journal Letters (APJL) - May 2026",
    doi: "10.3847/2041-8213/ad265c",
    abstract: "We report the detection of a persistent TeV gama-ray outburst originating from the core jet structure of AGN galaxies. Dynamic modeling suggests massive magnetic reconnection shocks near the Schwarzschild radius accelerate leptons, mimicking high energy synchotron self-Compton scatterings. This is verified using multi-band telemetry from CTA, MAGIC and terrestrial deep orbit telescope lattices.",
    citations: [
      "Aharonian, F., et al. 2007, A&A, 473, L1",
      "Blandford, R. D., & Znajek, R. L. 1977, MNRAS, 179, 433",
      "Ghisellini, G., & Tavecchio, F. 2009, MNRAS, 397, 985"
    ],
    findings: [
      "Lepton acceleration velocities approach 0.9998c under extreme magnetic reconnect field topologies.",
      "A TeV flare of this magnitude indicates the black hole magnetosphere is highly dynamic and rotating rapidly.",
      "Standard synchrotron emission models cannot account for the observed TeV spectrum without dark matter decay alignments."
    ]
  },
  {
    id: "paper-02",
    title: "Reconstituting Gravitational Lens DM-2104 to Map Localized Dark Matter Gas Concentricity",
    authors: "Sarah Chen, Dr. Arthur Dent, Dr. Frank Drake",
    journal: "Monthly Notices of the Royal Astronomical Society - Feb 2026",
    doi: "10.1093/mnras/stad421",
    abstract: "This paper introduces a neural density mapping framework utilizing weak gravitational lensing arcs in galaxy clusters. By measuring pixel-level light deflection profiles across high-redshift lensed arcs, we establish sub-kiloparsec dark matter filament structures. This disproves cold-dark-matter uniform density halos at early universe epochs.",
    citations: [
      "Navarro, J. F., Frenk, C. S., & White, S. D. M. 1997, ApJ, 490, 493",
      "Kaiser, N., & Squires, G. 1993, ApJ, 404, 441",
      "Trotter, C. S., & Einstein, A. (Posthumous review on spatial curved topologies)"
    ],
    findings: [
      "Strong lensing regions reveal clumped dark matter distributions averaging 12% denser than global models suggest.",
      "Anomalously high deflection parameters in Virgo clusters are likely caused by pristine cosmic string remnants.",
      "Dark matter gas concentricity tracks smoothly alongside stellar hydrogen clouds in newly seeded galaxies."
    ]
  }
];

// --- Cosmic Chat Bot presets ---
export const ASTROPHYSICS_PRESETS = [
  {
    label: "Compute Relativistic Orbit Speed",
    prompt: "Show me the mathematical step-by-step model for measuring active accretion disk rotation speeds around a 10^9 solar mass black hole. Explain redshift variables.",
  },
  {
    label: "Analyze Dark Matter Filament Arc",
    prompt: "Summarize current scientific consensus regarding localized dark matter gas concentricity around gravitational lensed arcs. Highlight key observational contradictions.",
  },
  {
    label: "Explain Fast Radio Burst Collapses",
    prompt: "Draft an analytical hypothesis of a magnetic star (magnetar) core collapse triggering high-energy millisecond radiowave anomalies. Keep it mathematically consistent.",
  }
];

// --- 3. DATABASE SCHEMAS DESIGN ---
export const SYSTEM_DATABASE_SCHEMAS = [
  {
    table: "galaxies",
    description: "Primary astronomical target catalog containing astrometric, spectral, and redshift parameters.",
    sql: `CREATE TABLE galaxies (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(100) NOT NULL,
  ra VARCHAR(50) NOT NULL, -- Right Ascension coordinate 
  dec VARCHAR(50) NOT NULL, -- Declination coordinate
  distance_mly FLOAT NOT NULL,
  redshift FLOAT NOT NULL,
  anomaly_score INT DEFAULT 0 CHECK (anomaly_score BETWEEN 0 AND 100),
  spectral_wavelengths FLOAT[] NOT NULL,
  radial_velocity VARCHAR(100),
  observed_status VARCHAR(100) DEFAULT 'Stable',
  discovered_epoch TIMESTAMP,
  system_metadata JSONB -- Astro-Telemetry metadata tags (Palantir mapping)
);

CREATE INDEX idx_galaxies_coordinates ON galaxies(ra, dec);
CREATE INDEX idx_galaxies_anomaly ON galaxies(anomaly_score);`
  },
  {
    table: "observations_and_telescope_uploads",
    description: "Saves high-resolution fits or image uploads from terrestrial and deep space observatories, and outputs the AI neural multi-band parameters.",
    sql: `CREATE TABLE observations_and_telescope_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  galaxy_id VARCHAR(64) REFERENCES galaxies(id) ON DELETE SET NULL,
  observer_id VARCHAR(64), -- User profile identifier
  source_telescope VARCHAR(255) NOT NULL, -- James Webb, Keck, CTA, etc.
  waveband VARCHAR(50) CHECK (waveband IN ('Optical', 'Infrared', 'Radio', 'X-Ray', 'Multi-Spectral')),
  raw_image_url TEXT,
  spectral_data JSONB, -- Fitted intensity-to-wavelength vectors
  ai_parsed_type VARCHAR(100),
  neural_confidence_score FLOAT CHECK (neural_confidence_score BETWEEN 0.0 AND 1.0),
  ai_observation_insight TEXT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_uploads_galaxy ON observations_and_telescope_uploads(galaxy_id);`
  },
  {
    table: "cosmic_events",
    description: "Supernovae, FRB, magnetar, and asteroid transient objects tracked directly from transient survey streams (ZTF/LSST/LIGO).",
    sql: `CREATE TABLE cosmic_events (
  id VARCHAR(64) PRIMARY KEY,
  event_name VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  origin_source VARCHAR(255),
  energy_output TEXT,
  alert_level VARCHAR(20) DEFAULT 'Low',
  ra_coordinates VARCHAR(100),
  dec_coordinates VARCHAR(100),
  time_observed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  time_to_decay_seconds INT,
  is_verified_by_observatory BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_events_type ON cosmic_events(event_type);`
  },
  {
    table: "ai_conversations_and_research",
    description: "Saves individual astrophysics copilot interactions, parsed papers, and chat session weights.",
    sql: `CREATE TABLE ai_conversations (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255),
  conversation_history JSONB NOT NULL, -- Array of Role: Text parameters
  last_interaction_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  tokens_used INT DEFAULT 0
);

CREATE TABLE compiled_research_papers (
  paper_id VARCHAR(64) PRIMARY KEY,
  title TEXT NOT NULL,
  doi VARCHAR(100) UNIQUE,
  key_authors TEXT[],
  abstract TEXT,
  ai_summary TEXT,
  extracted_citations TEXT[],
  findings TEXT[],
  ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  }
];

// --- 4. API SPECIFICATION OVERVIEW ---
export const API_SPECIFICATIONS = [
  {
    path: "POST /api/gemini/chat",
    description: "Submits client prompts along with optional context to the backend Gemini-3.5-flash engine. Implements standard reasoning guidelines.",
    request: `{
  message: string;      // The user astrophysics query
  history?: Array<{     // Optional conversation memory logs
    role: "user" | "model";
    parts: string[];
  }>;
}`,
    response: `{
  message: string;      // Markdown generated output
  tokens: number;       // Approximate token footprint 
  timestamp: string;
}`
  },
  {
    path: "POST /api/gemini/analyze",
    description: "Accepts multi-band telescope image base64 arrays or preset target systems, running multi-spectral parsing and generating comprehensive anomaly detection reviews.",
    request: `{
  galaxyId?: string;          // Target galaxy catalog selection
  imageBytes?: string;        // Base64 telescope telemetry or raw fits payload
  mimeType?: string;          // image/jpeg or image/png representation
  wavebands?: Array<string>;  // e.g. ["Gamma-Ray", "Infrared", "Radio"]
}`,
    response: `{
  detectedType: string;
  calculatedAnomalyScore: number;
  highlightedRegions: Array<{ region: string; anomaly: string }>;
  observationSummary: string; // Dynamic astrophysical report
  spectralFitCoefficients: Array<number>;
}`
  },
  {
    path: "POST /api/gemini/summarize",
    description: "Processes uploaded PDFs or pasted abstracts of papers. Extracted elements include main citations, statistical variances and findings.",
    request: `{
  abstractText: string;
  compareWithDoi?: string; // Optional baseline paper to compare variables against
}`,
    response: `{
  summary: string;
  citations: Array<string>;
  findings: Array<string>;
  comparativeMatrix: string;
}`
  }
];

// --- 5. SUGGESTED ASTROPHYSICS AI MODELS ---
export const SUGGESTED_AI_MODELS = [
  {
    task: "Multimodal Galaxy Core Parsing",
    model: "gemini-3.5-flash",
    reason: "Offers broad token context windows, supports raw visual inputs, and excels at returning highly-structured JSON responses mapping telescope coordinates and anomalies quickly and at low cost."
  },
  {
    task: "Advanced Stellar Formula Verification",
    model: "gemini-3.1-pro-preview",
    reason: "A premium model that handles complex scientific reasoning sheets, cross-references multi-step Keplerian variables, and computes precise orbit matrices with excellent STEM proficiency."
  },
  {
    task: "Astronomical Synthetic Imagery & Density Maps",
    model: "gemini-3.1-flash-image-preview",
    reason: "Excellent for generating high-definition multi-spectral 1K synthetic galaxy simulations, heat-maps, and lensed curvature visuals using natural language coordinate boundaries."
  }
];

// --- 6. AI WORKFLOW SYSTEM PIPELINE ---
export const SYSTEM_WORKFLOW_STEPS = [
  {
    step: "1. Telescope Capture & Stream Ingestion",
    detail: "Observatory raw visual vectors (.FITS or PNG format) are streamed into the CosmicMind ingest worker. Metadata including Right Ascension, Declination, and optical wavebands are parsed."
  },
  {
    step: "2. Image Embedding & Feature Alignment",
    detail: "Telescope images are passed into an image embedder. The output feature maps are combined with historical telemetry datasets to pinpoint anomalies."
  },
  {
    step: "3. Anomaly Scorer & Multi-Spectral Fitting",
    detail: "A neural structure compares the current light curve deflection against cosmic background curves, returning a calibrated Anomaly Index (0-100%)."
  },
  {
    step: "4. Gemini Context Conditioning",
    detail: "The telemetry, raw details, and coordinates are appended to the system instruction prompting Gemini-3.5-flash to format structured astrophysical reports."
  },
  {
    step: "5. Vector Database Cross-Reference & Copilot Delivery",
    detail: "Extracted citations and findings are cross-referenced with related documents in the astrophysics vector store (Pinecone/Postgres pgvector) to avoid hallucinations."
  }
];
