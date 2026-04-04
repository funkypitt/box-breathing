import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import BreathingSquare from '../components/BreathingSquare';
import Timer from '../components/Timer';
import {
  COLORS,
  TOTAL_DURATION_MS,
  PHASE_SWITCH_MS,
  RHYTHM_PHASE1,
  RHYTHM_PHASE2,
} from '../constants/breathing';

// Compute breathing state from elapsed time
function getBreathingState(elapsedMs: number) {
  // Phase 1: 0-2min = 3s rhythm, Phase 2: 2-4min = 4s rhythm
  // At the 2-min mark, we finish the current 3s cycle, then switch to 4s
  const rhythm1 = RHYTHM_PHASE1;
  const rhythm2 = RHYTHM_PHASE2;
  const cycle1 = rhythm1 * 4; // 12s
  const cycle2 = rhythm2 * 4; // 16s

  let sideIndex: number;
  let sideProgress: number;
  let sideDurationMs: number;
  let cycleProgress: number;
  let isTransitioning = false;

  if (elapsedMs < PHASE_SWITCH_MS) {
    // Phase 1: 3-3-3-3
    const cycleTime = elapsedMs % cycle1;
    sideIndex = Math.floor(cycleTime / rhythm1) % 4;
    const sideElapsed = cycleTime - sideIndex * rhythm1;
    sideDurationMs = rhythm1;
    // Apply ease-in-out
    const linear = sideElapsed / rhythm1;
    sideProgress = easeInOutSin(linear);
    cycleProgress = cycleTime / cycle1;
  } else {
    // Phase 2: 4-4-4-4
    const phase2Elapsed = elapsedMs - PHASE_SWITCH_MS;
    const cycleTime = phase2Elapsed % cycle2;
    sideIndex = Math.floor(cycleTime / rhythm2) % 4;
    const sideElapsed = cycleTime - sideIndex * rhythm2;
    sideDurationMs = rhythm2;
    const linear = sideElapsed / rhythm2;
    sideProgress = easeInOutSin(linear);
    cycleProgress = cycleTime / cycle2;

    // Transition indicator: show within first 3 seconds of phase 2
    if (phase2Elapsed < 3000) {
      isTransitioning = true;
    }
  }

  const sideElapsedRaw =
    elapsedMs < PHASE_SWITCH_MS
      ? (elapsedMs % cycle1) - sideIndex * rhythm1
      : ((elapsedMs - PHASE_SWITCH_MS) % cycle2) - sideIndex * rhythm2;
  const countdown = Math.ceil((sideDurationMs - sideElapsedRaw) / 1000);

  return { sideIndex, sideProgress, countdown, cycleProgress, isTransitioning };
}

function easeInOutSin(t: number): number {
  'worklet';
  return (1 - Math.cos(Math.PI * t)) / 2;
}

export default function BreathingScreen() {
  const router = useRouter();
  const startTime = useRef(Date.now());
  const rafRef = useRef<number | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);

  const screenOpacity = useSharedValue(0);
  const squareOpacity = useSharedValue(1);
  const endTextOpacity = useSharedValue(0);
  const transitionMsgOpacity = useSharedValue(0);
  const borderFlashValue = useSharedValue(0);

  // Fade in on mount
  useEffect(() => {
    screenOpacity.value = withTiming(1, { duration: 800, easing: Easing.in(Easing.ease) });
  }, []);

  // Main animation loop
  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      const now = Date.now();
      const ms = now - startTime.current;
      if (ms >= TOTAL_DURATION_MS) {
        setElapsed(TOTAL_DURATION_MS);
        setFinished(true);
        return;
      }
      setElapsed(ms);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Handle transition message & border flash
  const prevTransitioning = useRef(false);
  const state = getBreathingState(elapsed);

  useEffect(() => {
    if (state.isTransitioning && !prevTransitioning.current) {
      transitionMsgOpacity.value = withTiming(1, { duration: 400, easing: Easing.in(Easing.ease) });
      borderFlashValue.value = 1;
      borderFlashValue.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) });
      setTimeout(() => {
        transitionMsgOpacity.value = withTiming(0, {
          duration: 600,
          easing: Easing.out(Easing.ease),
        });
      }, 2000);
    }
    prevTransitioning.current = state.isTransitioning;
  }, [state.isTransitioning]);

  // Handle finish
  const goHome = useCallback(() => {
    router.replace('/');
  }, [router]);

  useEffect(() => {
    if (!finished) return;
    // Fade out square
    squareOpacity.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) });
    // Fade in end text
    setTimeout(() => {
      endTextOpacity.value = withTiming(1, { duration: 600, easing: Easing.in(Easing.ease) });
    }, 400);
    // After 3s pause, fade everything and go home
    setTimeout(() => {
      screenOpacity.value = withTiming(
        0,
        { duration: 1000, easing: Easing.out(Easing.ease) },
        (done) => {
          if (done) runOnJS(goHome)();
        },
      );
    }, 4000);
  }, [finished]);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const squareFadeStyle = useAnimatedStyle(() => ({
    opacity: squareOpacity.value,
  }));

  const endFadeStyle = useAnimatedStyle(() => ({
    opacity: endTextOpacity.value,
  }));

  const transitionStyle = useAnimatedStyle(() => ({
    opacity: transitionMsgOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[COLORS.bgTop, COLORS.bgBottom]}
      style={styles.gradient}
    >
      <Animated.View style={[styles.container, fadeStyle]}>
        <Timer elapsedMs={elapsed} />

        <View style={styles.squareArea}>
          <Animated.View style={squareFadeStyle}>
            <BreathingSquare
              sideProgress={state.sideProgress}
              sideIndex={state.sideIndex}
              countdown={state.countdown}
              cycleProgress={state.cycleProgress}
              borderFlash={0}
            />
          </Animated.View>
        </View>

        {/* Transition message */}
        <Animated.View style={[styles.transitionMsg, transitionStyle]}>
          <Text style={styles.transitionEn}>Slowing down…</Text>
          <Text style={styles.transitionFr}>On ralentit…</Text>
        </Animated.View>

        {/* End text */}
        {finished && (
          <Animated.View style={[styles.endContainer, endFadeStyle]}>
            <Text style={styles.endEn}>Well done!</Text>
            <Text style={styles.endFr}>Bravo !</Text>
          </Animated.View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  squareArea: {
    flex: 1,
    justifyContent: 'center',
  },
  transitionMsg: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
  },
  transitionEn: {
    color: COLORS.text,
    opacity: 0.4,
    fontSize: 14,
    fontWeight: '300',
  },
  transitionFr: {
    color: COLORS.text,
    opacity: 0.3,
    fontSize: 12,
    fontWeight: '300',
    marginTop: 2,
  },
  endContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endEn: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '200',
  },
  endFr: {
    color: COLORS.text,
    opacity: 0.6,
    fontSize: 20,
    fontWeight: '300',
    marginTop: 8,
  },
});
