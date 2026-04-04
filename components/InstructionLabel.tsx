import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, INSTRUCTIONS } from '../constants/breathing';

interface Props {
  sideIndex: number; // 0-3
  countdown: number; // seconds remaining in current side
}

export default function InstructionLabel({ sideIndex, countdown }: Props) {
  const opacity = useSharedValue(1);
  const prevSide = useSharedValue(sideIndex);

  useEffect(() => {
    if (prevSide.value !== sideIndex) {
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      prevSide.value = sideIndex;
    }
  }, [sideIndex]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const instruction = INSTRUCTIONS[sideIndex];

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Animated.Text style={styles.en}>{instruction.en}</Animated.Text>
      <Animated.Text style={styles.fr}>{instruction.fr}</Animated.Text>
      <Animated.Text style={styles.countdown}>{countdown}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
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
