import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, Technique, Phase } from '../constants/breathing';
import { buildShape, fitShape, pathOf, pointAt, travelled } from '../constants/geometry';
import InstructionLabel from './InstructionLabel';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CANVAS = SCREEN_WIDTH * 0.8;
const PAD = 20; // room for the dot's halo around the shape
const DOT_RADIUS = 8;

interface Props {
  technique: Technique;
  phaseIndex: number;
  phaseProgress: number;
  phase: Phase;
  countdown: number;
}

export default function BreathingShape({
  technique,
  phaseIndex,
  phaseProgress,
  phase,
  countdown,
}: Props) {
  const geometry = useMemo(
    () =>
      fitShape(
        buildShape(
          technique.shape,
          technique.phases.map((p) => p.ms),
        ),
        CANVAS,
        CANVAS,
        PAD,
      ),
    [technique],
  );
  const path = useMemo(() => pathOf(geometry), [geometry]);
  const pos = pointAt(geometry.edges[phaseIndex], phaseProgress);
  const done = travelled(geometry, phaseIndex, phaseProgress);

  return (
    <View style={styles.wrapper}>
      <Svg width={CANVAS} height={CANVAS}>
        <Path
          d={path}
          fill="rgba(255, 255, 255, 0.02)"
          stroke={COLORS.outline}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d={path}
          fill="none"
          stroke={COLORS.borderPurple}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={[geometry.perimeter, geometry.perimeter]}
          strokeDashoffset={geometry.perimeter - done}
        />
        <Circle cx={pos.x} cy={pos.y} r={DOT_RADIUS * 2} fill={COLORS.dotHalo} />
        <Circle cx={pos.x} cy={pos.y} r={DOT_RADIUS} fill={COLORS.dot} />
      </Svg>

      <InstructionLabel phaseIndex={phaseIndex} phase={phase} countdown={countdown} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
});
