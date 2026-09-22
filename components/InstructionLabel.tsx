import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, Phase } from '../constants/breathing';

interface Props {
  phaseIndex: number;
  phase: Phase;
  countdown: number; // seconds remaining in the current phase
}

export default function InstructionLabel({ phaseIndex, phase, countdown }: Props) {
  const opacity = useSharedValue(1);
  const prevPhase = useSharedValue(phaseIndex);

  useEffect(() => {
    if (prevPhase.value !== phaseIndex) {
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      prevPhase.value = phaseIndex;
    }
  }, [phaseIndex]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Animated.Text style={styles.en}>{phase.en}</Animated.Text>
      <Animated.Text style={styles.fr}>{phase.fr}</Animated.Text>
      <Animated.Text style={styles.countdown}>{countdown}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  en: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '300',
    marginBottom: 4,
  },
  fr: {
    color: COLORS.text,
    opacity: 0.5,
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 8,
  },
  countdown: {
    color: COLORS.text,
    opacity: 0.4,
    fontSize: 14,
    fontWeight: '300',
  },
});
