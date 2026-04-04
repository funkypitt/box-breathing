import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { COLORS } from '../constants/breathing';
import InstructionLabel from './InstructionLabel';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SQUARE_SIZE = SCREEN_WIDTH * 0.65;
const DOT_SIZE = 16;
const BORDER_RADIUS = 12;

interface Props {
  sideProgress: number;
  sideIndex: number;
  countdown: number;
  cycleProgress: number;
  borderFlash: number;
}

// Corners: bottom-left(0) -> top-left(1) -> top-right(2) -> bottom-right(3)
const corners = [
  { x: 0, y: SQUARE_SIZE },
  { x: 0, y: 0 },
  { x: SQUARE_SIZE, y: 0 },
  { x: SQUARE_SIZE, y: SQUARE_SIZE },
];

function getDotPosition(sideIndex: number, progress: number) {
  const from = corners[sideIndex];
  const to = corners[(sideIndex + 1) % 4];
  return {
    x: from.x + (to.x - from.x) * progress,
    y: from.y + (to.y - from.y) * progress,
  };
}

// Trace segments: 4 sides, each with a fill percentage
function getTraceSegments(sideIndex: number, sideProgress: number) {
  // Sides: 0=left(up), 1=top(right), 2=right(down), 3=bottom(left)
  const segments = [0, 0, 0, 0];
  for (let i = 0; i < sideIndex; i++) {
    segments[i] = 1;
  }
  segments[sideIndex] = sideProgress;
  return segments;
}

export default function BreathingSquare({
  sideProgress,
  sideIndex,
  countdown,
  cycleProgress,
  borderFlash,
}: Props) {
  const pos = getDotPosition(sideIndex, sideProgress);
  const trace = getTraceSegments(sideIndex, sideProgress);
  const borderOpacity = Math.min(0.5 + borderFlash * 0.5, 1);

  return (
    <View style={styles.wrapper}>
      {/* Base border */}
      <View style={[styles.square, { borderColor: `rgba(155, 127, 212, 0.3)` }]} />

      {/* Trace segments - left side (bottom to top) */}
      <View
        style={[
          styles.traceLeft,
          {
            height: SQUARE_SIZE * trace[0],
            bottom: 0,
            opacity: borderOpacity,
          },
        ]}
      />
      {/* Top side (left to right) */}
      <View
        style={[
          styles.traceTop,
          {
            width: SQUARE_SIZE * trace[1],
            left: 0,
            opacity: borderOpacity,
          },
        ]}
      />
      {/* Right side (top to bottom) */}
      <View
        style={[
          styles.traceRight,
          {
            height: SQUARE_SIZE * trace[2],
            top: 0,
            opacity: borderOpacity,
          },
        ]}
      />
      {/* Bottom side (right to left) */}
      <View
        style={[
          styles.traceBottom,
          {
            width: SQUARE_SIZE * trace[3],
            right: 0,
            opacity: borderOpacity,
          },
        ]}
      />

      {/* Instructions */}
      <View style={styles.innerContainer}>
        <InstructionLabel sideIndex={sideIndex} countdown={countdown} />
      </View>

      {/* Animated dot */}
      <View
        style={[
          styles.dot,
          {
            transform: [
              { translateX: pos.x - DOT_SIZE / 2 },
              { translateY: pos.y - DOT_SIZE / 2 },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    alignSelf: 'center',
  },
  square: {
    position: 'absolute',
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: BORDER_RADIUS,
    borderWidth: 2,
    borderColor: 'rgba(155, 127, 212, 0.3)',
  },
  traceLeft: {
    position: 'absolute',
    left: -1,
    width: 2,
    backgroundColor: COLORS.borderPurple,
    borderRadius: 1,
  },
  traceTop: {
    position: 'absolute',
    top: -1,
    height: 2,
    backgroundColor: COLORS.borderPurple,
    borderRadius: 1,
  },
  traceRight: {
    position: 'absolute',
    right: -1,
    width: 2,
    backgroundColor: COLORS.borderPurple,
    borderRadius: 1,
  },
  traceBottom: {
    position: 'absolute',
    bottom: -1,
    height: 2,
    backgroundColor: COLORS.borderPurple,
    borderRadius: 1,
  },
  innerContainer: {
    position: 'absolute',
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: COLORS.dot,
    shadowColor: COLORS.dot,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
});
