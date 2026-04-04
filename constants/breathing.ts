export const COLORS = {
  bgTop: '#0a0a1a',
  bgBottom: '#1a0a2e',
  text: '#e8e0f0',
  purple: '#7c5cbf',
  borderPurple: '#9b7fd4',
  dot: '#c4a0e8',
  subtleBg: 'rgba(255,255,255,0.02)',
};

export const TOTAL_DURATION_MS = 4 * 60 * 1000; // 4 minutes
export const PHASE_SWITCH_MS = 2 * 60 * 1000; // 2 minutes

export const RHYTHM_PHASE1 = 3000; // 3s per side
export const RHYTHM_PHASE2 = 4000; // 4s per side

export const INSTRUCTIONS = [
  { en: 'Breathe in', fr: 'Inspire' },
  { en: 'Hold', fr: 'Retiens' },
  { en: 'Breathe out', fr: 'Expire' },
  { en: 'Hold', fr: 'Retiens' },
] as const;
