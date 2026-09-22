import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import BreathingShape from '../components/BreathingShape';
import Timer from '../components/Timer';
import { COLORS, findTechnique, buildSchedule, Schedule } from '../constants/breathing';

// Compute breathing state from elapsed time
function getBreathingState(schedule: Schedule, elapsedMs: number) {
  const { segments } = schedule;
  let i = segments.length - 1;
  while (i > 0 && segments[i].startMs > elapsedMs) i--;
  const seg = segments[i];
  const phaseElapsed = Math.min(elapsedMs - seg.startMs, seg.phase.ms);
  const phaseProgress = easeInOutSin(phaseElapsed / seg.phase.ms);
  const countdown = Math.max(1, Math.ceil((seg.phase.ms - phaseElapsed) / 1000));
  const isSlowing =
    schedule.slowingAtMs !== null &&
    elapsedMs >= schedule.slowingAtMs &&
    elapsedMs < schedule.slowingAtMs + 3000;

  return { phaseIndex: seg.phaseIndex, phase: seg.phase, phaseProgress, countdown, isSlowing };
}

function easeInOutSin(t: number): number {
  'worklet';
  return (1 - Math.cos(Math.PI * t)) / 2;
}

export default function BreathingScreen() {
  useKeepAwake();
  const router = useRouter();
  const params = useLocalSearchParams<{ technique?: string }>();
  const technique = useMemo(() => findTechnique(params.technique), [params.technique]);
  const schedule = useMemo(() => buildSchedule(technique), [technique]);
  const startTime = useRef(Date.now());
  const rafRef = useRef<number | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);

  const screenOpacity = useSharedValue(0);
  const shapeOpacity = useSharedValue(1);
  const endTextOpacity = useSharedValue(0);
  const transitionMsgOpacity = useSharedValue(0);

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
      if (ms >= schedule.totalMs) {
        setElapsed(schedule.totalMs);
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
  }, [schedule]);

  // Handle the slowing-down message (box breathing only)
  const prevSlowing = useRef(false);
  const state = getBreathingState(schedule, elapsed);

  useEffect(() => {
    if (state.isSlowing && !prevSlowing.current) {
      transitionMsgOpacity.value = withTiming(1, { duration: 400, easing: Easing.in(Easing.ease) });
      setTimeout(() => {
        transitionMsgOpacity.value = withTiming(0, {
          duration: 600,
          easing: Easing.out(Easing.ease),
        });
      }, 2000);
    }
    prevSlowing.current = state.isSlowing;
  }, [state.isSlowing]);

  // Handle finish
  const goHome = useCallback(() => {
    router.replace('/');
  }, [router]);

  useEffect(() => {
    if (!finished) return;
    // Fade out shape
    shapeOpacity.value = withTiming(0, { duration: 800, easing: Easing.out(Easing.ease) });
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

  const shapeFadeStyle = useAnimatedStyle(() => ({
    opacity: shapeOpacity.value,
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

        <View style={styles.shapeArea}>
          <Animated.View style={shapeFadeStyle}>
            <BreathingShape
              technique={technique}
              phaseIndex={state.phaseIndex}
              phaseProgress={state.phaseProgress}
              phase={state.phase}
              countdown={state.countdown}
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
  shapeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  transitionMsg: {
    position: 'absolute',
    bottom: 80,
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
