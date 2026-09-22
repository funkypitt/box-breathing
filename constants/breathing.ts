import type { ShapeKind } from './geometry';

export const COLORS = {
  bgTop: '#0a0a1a',
  bgBottom: '#1a0a2e',
  text: '#e8e0f0',
  purple: '#7c5cbf',
  borderPurple: '#9b7fd4',
  outline: 'rgba(155, 127, 212, 0.3)',
  dot: '#c4a0e8',
  dotHalo: 'rgba(196, 160, 232, 0.25)',
};

export const TOTAL_DURATION_MS = 4 * 60 * 1000; // 4 minutes
export const HALFWAY_MS = 2 * 60 * 1000;

export interface Phase {
  en: string;
  fr: string;
  ms: number;
}

const IN = (s: number): Phase => ({ en: 'Breathe in', fr: 'Inspire', ms: s * 1000 });
const HOLD = (s: number): Phase => ({ en: 'Hold', fr: 'Retiens', ms: s * 1000 });
const OUT = (s: number): Phase => ({ en: 'Breathe out', fr: 'Expire', ms: s * 1000 });

export interface Technique {
  id: string;
  shape: ShapeKind;
  name: { en: string; fr: string };
  rhythm: string;
  note: { en: string; fr: string };
  // One edge of the shape per phase; edge lengths follow the durations.
  phases: Phase[];
  // Optional faster rhythm for the first two minutes (the box's 3 s → 4 s).
  openingPhases?: Phase[];
}

export const TECHNIQUES: Technique[] = [
  {
    id: 'box',
    shape: 'square',
    name: { en: 'Box breathing', fr: 'Respiration carrée' },
    rhythm: '4 · 4 · 4 · 4',
    note: { en: '3 s per side, then 4 s halfway', fr: '3 s par côté, puis 4 s à mi-parcours' },
    phases: [IN(4), HOLD(4), OUT(4), HOLD(4)],
    openingPhases: [IN(3), HOLD(3), OUT(3), HOLD(3)],
  },
  {
    id: 'triangle',
    shape: 'triangle',
    name: { en: 'Triangle breathing', fr: 'Respiration triangle' },
    rhythm: '4 · 4 · 4',
    note: { en: 'in, hold, out', fr: 'inspire, retiens, expire' },
    phases: [IN(4), HOLD(4), OUT(4)],
  },
  {
    id: '478',
    shape: 'triangle',
    name: { en: '4-7-8 breath', fr: 'Respiration 4-7-8' },
    rhythm: '4 · 7 · 8',
    note: { en: 'Dr Weil’s relaxing breath', fr: 'la respiration relaxante du Dr Weil' },
    phases: [IN(4), HOLD(7), OUT(8)],
  },
  {
    id: 'petal',
    shape: 'petal',
    name: { en: 'Long exhale', fr: 'Longue expiration' },
    rhythm: '3 · 3 · 6',
    note: { en: 'breathing out twice as long', fr: 'expirer deux fois plus longtemps' },
    phases: [IN(3), HOLD(3), OUT(6)],
  },
  {
    id: 'coherent',
    shape: 'circle',
    name: { en: 'Coherent breathing', fr: 'Cohérence cardiaque' },
    rhythm: '5 · 5',
    note: { en: 'six breaths a minute', fr: 'six respirations par minute' },
    phases: [IN(5), OUT(5)],
  },
];

export const DEFAULT_TECHNIQUE = TECHNIQUES[0];

export function findTechnique(id: string | undefined): Technique {
  return TECHNIQUES.find((t) => t.id === id) ?? DEFAULT_TECHNIQUE;
}

// The session as a flat list of phases. The opening rhythm runs until the
// first cycle boundary past the halfway mark; the session ends at the first
// cycle boundary past four minutes, so nobody is cut off mid-breath.
export interface Segment {
  phaseIndex: number;
  phase: Phase;
  startMs: number;
}

export interface Schedule {
  segments: Segment[];
  totalMs: number;
  slowingAtMs: number | null;
}

export function buildSchedule(technique: Technique): Schedule {
  const segments: Segment[] = [];
  let t = 0;
  let slowingAtMs: number | null = null;
  while (t < TOTAL_DURATION_MS) {
    let phases = technique.phases;
    if (technique.openingPhases && t < HALFWAY_MS) {
      phases = technique.openingPhases;
    } else if (technique.openingPhases && slowingAtMs === null) {
      slowingAtMs = t;
    }
    phases.forEach((phase, phaseIndex) => {
      segments.push({ phaseIndex, phase, startMs: t });
      t += phase.ms;
    });
  }
  return { segments, totalMs: t, slowingAtMs };
}
