import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import type { PhaseKind } from './breathing';

// Short cues for breathing with the eyes closed: a soft kalimba note at each change of phase
// (higher to breathe in, the root to hold, lower to breathe out) and one crystal bell at the
// start and the end of the session. Both recordings are CC0 (Freesound: hollandm, arseniiv).
const FILES = {
  in: require('../assets/sounds/kalimba-in.mp3'),
  hold: require('../assets/sounds/kalimba-hold.mp3'),
  out: require('../assets/sounds/kalimba-out.mp3'),
  bell: require('../assets/sounds/bell.mp3'),
};

type Cue = PhaseKind | 'bell';
const VOLUME = 0.8;
let players: Partial<Record<Cue, AudioPlayer>> = {};
let ready: Promise<void> | null = null;

// Players are made once and kept; a cue is replayed from its start.
export function prepareSounds(): Promise<void> {
  if (!ready) {
    ready = setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers', shouldPlayInBackground: false })
      .catch(() => undefined)
      .then(() => {
        for (const key of Object.keys(FILES) as Cue[]) {
          if (!players[key]) {
            const player = createAudioPlayer(FILES[key]);
            player.volume = VOLUME;
            players[key] = player;
          }
        }
      });
  }
  return ready;
}

export function playCue(cue: Cue): void {
  prepareSounds().then(() => {
    const player = players[cue];
    if (!player) return;
    try {
      player.seekTo(0);
      player.play();
    } catch {
      // a missing audio device is no reason to stop the exercise
    }
  });
}
