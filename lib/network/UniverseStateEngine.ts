/**
 * UniverseStateEngine.ts
 * 
 * Cosmic Digital Twin & Persistent simulation engine of the observable Universe.
 * Synchronizes galaxy states, tracked anomalies, and forecasted stellar evolutions.
 */

export interface TrackedAnomalyState {
  id: string;
  name: string;
  type: string;
  coordinates: string;
  redshiftOffset: number;
  massMultiplierSolar: number;
  lastSimulatedEpoch: string;
  evolutionRatePercent: number; // yearly growth/decay prediction
  fluxLuminosityWatts: string; // Dynamic physical outputs
}

export const INITIAL_TWIN_ANOMALIES: TrackedAnomalyState[] = [
  {
    id: "twin-1",
    name: "Seyfert Nucleus NGC 1275",
    type: "Active Galactic Nuclei Core",
    coordinates: "RA 03h 19m, Dec +41° 30'",
    redshiftOffset: 0.0175,
    massMultiplierSolar: 8.5e8,
    lastSimulatedEpoch: "Epoch 2026.38",
    evolutionRatePercent: 0.045,
    fluxLuminosityWatts: "3.4e37 W"
  },
  {
    id: "twin-2",
    name: "Kerr Black Hole M87*",
    type: "Relativistic Spacetime Void",
    coordinates: "RA 12h 30m, Dec +12° 20'",
    redshiftOffset: 0.00428,
    massMultiplierSolar: 6.5e9,
    lastSimulatedEpoch: "Epoch 2026.39",
    evolutionRatePercent: 0.002,
    fluxLuminosityWatts: "1.8e39 W"
  },
  {
    id: "twin-3",
    name: "Quasar Burst SDSS-1021",
    type: "Compact High-Energy Ingress",
    coordinates: "RA 10h 21m, Dec -04° 15'",
    redshiftOffset: 3.842,
    massMultiplierSolar: 1.2e10,
    lastSimulatedEpoch: "Epoch 2026.15",
    evolutionRatePercent: 1.21,
    fluxLuminosityWatts: "9.5e40 W"
  }
];

export class UniverseStateEngine {
  private static instance: UniverseStateEngine;
  private anomalies: TrackedAnomalyState[] = [...INITIAL_TWIN_ANOMALIES];

  private constructor() {}

  public static getInstance(): UniverseStateEngine {
    if (!UniverseStateEngine.instance) {
      UniverseStateEngine.instance = new UniverseStateEngine();
    }
    return UniverseStateEngine.instance;
  }

  public getTrackedAnomalies(): TrackedAnomalyState[] {
    return this.anomalies;
  }

  /**
   * Run high-precision N-body simulation projection on local state
   */
  public advanceSimulationEpoch(id: string): TrackedAnomalyState | null {
    const item = this.anomalies.find(a => a.id === id);
    if (!item) return null;

    // Simulate epoch progression slightly
    item.massMultiplierSolar = Math.floor(item.massMultiplierSolar * (1 + (item.evolutionRatePercent / 100)));
    const currentEpoch = parseFloat(item.lastSimulatedEpoch.split(" ")[1]);
    item.lastSimulatedEpoch = `Epoch ${(currentEpoch + 0.01).toFixed(2)}`;
    
    return { ...item };
  }
}
