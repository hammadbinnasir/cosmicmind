/**
 * CosmicEventBus.ts
 * 
 * Distributed Event Streaming and Kafka-Style Telemetry Bus
 * connecting planetary-scale observatories and scientific AGI nodes.
 */

export interface DeepSpaceObservatory {
  id: string;
  name: string;
  site: string;
  instruments: string[];
  wavelengths: ("Optical" | "Infrared" | "Radio" | "Gamma-Ray" | "X-Ray" | "Gravitational-Wave")[];
  gpsCoordinates: { lat: number; lng: number; elevationMeters: number };
  status: "active" | "maintenance" | "weather_lockout" | "calibrating";
  weatherCondition: {
    windVelocityKmh: number;
    humidityPercent: number;
    seeingArcsec: number;
    isCloudy: boolean;
  };
  activeTarget?: string;
}

export interface CosmicEvent {
  id: string;
  timestamp: string;
  topic: "supernova" | "grb" | "frb" | "gravitational_wave" | "asteroid_threat" | "agn_flare";
  priority: "critical" | "high" | "moderate" | "standard";
  sourceDevice: string;
  signalStrengthSigma: number; // significance measurement (sigma value)
  payload: {
    targetName: string;
    coordinates: string;
    description: string;
    wavebandDetails: string;
    estimatedDistanceLightyears: number;
    sensorMetadata: Record<string, any>;
  };
  verifiedBy: string[]; // Observatory IDs that completed cross-validation
}

// In-Memory Database for The Distributed Observatory Network infrastructure
export const PLANETARY_OBSERVATORIES: DeepSpaceObservatory[] = [
  {
    id: "obs-jwst",
    name: "JWST Lagrange Point-2 Array",
    site: "Sun-Earth L2 Halo Orbit",
    instruments: ["NIRSpec", "MIRI", "NIRCam"],
    wavelengths: ["Infrared"],
    gpsCoordinates: { lat: 0.0, lng: 0.0, elevationMeters: 1500000000 },
    status: "active",
    weatherCondition: { windVelocityKmh: 0, humidityPercent: 0, seeingArcsec: 0.04, isCloudy: false },
    activeTarget: "SGR-1806 Magnetar Core"
  },
  {
    id: "obs-mauna-kea",
    name: "Keck Dual Telescopes System",
    site: "Mauna Kea Peak, Hawaii",
    instruments: ["DEIMOS", "HIRES", "KCWI"],
    wavelengths: ["Optical", "Infrared"],
    gpsCoordinates: { lat: 19.8206, lng: -155.4681, elevationMeters: 4145 },
    status: "active",
    weatherCondition: { windVelocityKmh: 12.5, humidityPercent: 24, seeingArcsec: 0.55, isCloudy: false },
    activeTarget: "M87 Relativistic Synchrotron Jet"
  },
  {
    id: "obs-ligo-hanford",
    name: "LIGO Hanford Interferometer",
    site: "Washington, USA",
    instruments: ["4km Laser Beam Line"],
    wavelengths: ["Gravitational-Wave"],
    gpsCoordinates: { lat: 46.4553, lng: -119.4075, elevationMeters: 115 },
    status: "active",
    weatherCondition: { windVelocityKmh: 18.0, humidityPercent: 35, seeingArcsec: 0.0, isCloudy: false },
    activeTarget: "GW-2026-X41 Binary Merger"
  },
  {
    id: "obs-vla-new-mexico",
    name: "Very Large Array (VLA)",
    site: "Socorro, New Mexico",
    instruments: ["27-Cassegrain Receivers System"],
    wavelengths: ["Radio"],
    gpsCoordinates: { lat: 34.0789, lng: -107.6184, elevationMeters: 2124 },
    status: "weather_lockout",
    weatherCondition: { windVelocityKmh: 68.0, humidityPercent: 88, seeingArcsec: 1.8, isCloudy: true },
    activeTarget: "None (Thunderstorm Lockout)"
  },
  {
    id: "obs-alma-chile",
    name: "ALMA Submillimeter Array",
    site: "Chajnantor Plateau, Chile",
    instruments: ["66 High-precision Antennas"],
    wavelengths: ["Radio", "Infrared"],
    gpsCoordinates: { lat: -23.0193, lng: -67.7532, elevationMeters: 5050 },
    status: "calibrating",
    weatherCondition: { windVelocityKmh: 8.2, humidityPercent: 12, seeingArcsec: 0.35, isCloudy: false },
    activeTarget: "Dust Rings around HL Tau"
  },
  {
    id: "obs-icecube-southpole",
    name: "IceCube Neutrino Laboratory",
    site: "Amundsen-Scott South Pole",
    instruments: ["Digital Optical Modules Array"],
    wavelengths: ["Gamma-Ray"], // Particle detection acts similar
    gpsCoordinates: { lat: -90.0, lng: 0.0, elevationMeters: 2835 },
    status: "active",
    weatherCondition: { windVelocityKmh: 24.5, humidityPercent: 5, seeingArcsec: 0.01, isCloudy: false },
    activeTarget: "Fermi Neutrino Point-Source Arc"
  }
];

// Seed Alerts reflecting Kafka-style Transient Pipeline
export const INITIAL_COSMIC_EVENTS: CosmicEvent[] = [
  {
    id: "event-grb-260520",
    timestamp: "12:01:22 UTC",
    topic: "grb",
    priority: "critical",
    sourceDevice: "Swift Space Satellite",
    signalStrengthSigma: 42.8,
    payload: {
      targetName: "GRB-260520-A Hyper-Flare",
      coordinates: "RA 18h 45m, Dec -29° 00'",
      description: "Collimated relativistic gamma shockwave following massive core collapse supernova.",
      wavebandDetails: "10-250 keV High Intensity Gammas",
      estimatedDistanceLightyears: 4.8e9,
      sensorMetadata: { triggerIndex: 94812, fluenceErgCm2: "1.24e-4" }
    },
    verifiedBy: ["obs-jwst", "obs-icecube-southpole"]
  },
  {
    id: "event-gw-2026",
    timestamp: "11:54:10 UTC",
    topic: "gravitational_wave",
    priority: "critical",
    sourceDevice: "LIGO / Virgo Consolidated Trigger",
    signalStrengthSigma: 18.2,
    payload: {
      targetName: "GW-2026-X41 Binary Merger",
      coordinates: "RA 03h 12m, Dec +41° 15'",
      description: "Strong localized ripples in spacetime spacetime fabrics indicating binary stellar black hole coalescence.",
      wavebandDetails: "35 Hz - 250 Hz Geodesic Vibration Sinks",
      estimatedDistanceLightyears: 1.2e9,
      sensorMetadata: { chirpMassMultiplier: 28.4, chirpSymmetricEta: 0.245 }
    },
    verifiedBy: ["obs-ligo-hanford"]
  },
  {
    id: "event-frb-94",
    timestamp: "11:12:00 UTC",
    topic: "frb",
    priority: "high",
    sourceDevice: "CHIME Radio Antennas Pipeline",
    signalStrengthSigma: 12.4,
    payload: {
      targetName: "FRB-260520-X12 Repeat Pulse",
      coordinates: "RA 05h 21m, Dec -14° 03'",
      description: "Periodic millisecond-duration radio burst repeating on active cycle indices.",
      wavebandDetails: "400 - 800 MHz Coaligned Pulsation bands",
      estimatedDistanceLightyears: 8.5e8,
      sensorMetadata: { dispersionMeasure: 345.9, activeCyclePeriodDays: 16.3 }
    },
    verifiedBy: ["obs-alma-chile", "obs-mauna-kea"]
  }
];

export class CosmicEventBus {
  private static instance: CosmicEventBus;
  private observatories: DeepSpaceObservatory[] = [...PLANETARY_OBSERVATORIES];
  private events: CosmicEvent[] = [...INITIAL_COSMIC_EVENTS];
  private alertSubscriptions: Record<string, string[]> = {
    "grb": ["obs-jwst", "obs-mauna-kea", "obs-icecube-southpole"],
    "gravitational_wave": ["obs-ligo-hanford", "obs-jwst"],
    "frb": ["obs-alma-chile", "obs-mauna-kea", "obs-vla-new-mexico"]
  };

  private constructor() {}

  public static getInstance(): CosmicEventBus {
    if (!CosmicEventBus.instance) {
      CosmicEventBus.instance = new CosmicEventBus();
    }
    return CosmicEventBus.instance;
  }

  public getObservatories(): DeepSpaceObservatory[] {
    return this.observatories;
  }

  public updateObservatoryStatus(id: string, state: "active" | "maintenance" | "weather_lockout" | "calibrating") {
    const obs = this.observatories.find(o => o.id === id);
    if (obs) {
      obs.status = state;
    }
  }

  public getEvents(): CosmicEvent[] {
    return this.events;
  }

  public publishEvent(event: Omit<CosmicEvent, "id" | "timestamp" | "verifiedBy">): CosmicEvent {
    const generatedEvent: CosmicEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + " UTC",
      verifiedBy: []
    };
    this.events.unshift(generatedEvent);
    this.triggerAutoVerification(generatedEvent.id);
    return generatedEvent;
  }

  // Simulated automatic multi-observatory verification trigger loops
  private triggerAutoVerification(eventId: string) {
    setTimeout(() => {
      const evt = this.events.find(e => e.id === eventId);
      if (evt) {
        const fittingObs = this.observatories
          .filter(o => o.status === "active" && !o.weatherCondition.isCloudy)
          .map(o => o.id);
        
        // Grab maximum 2 corresponding verified signatures
        evt.verifiedBy = [...new Set([...evt.verifiedBy, ...fittingObs.slice(0, 2)])];
      }
    }, 2800);
  }
}
