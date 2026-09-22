import React, { useMemo } from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS, Technique } from '../constants/breathing';
import { buildShape, fitShape, pathOf, pointAt } from '../constants/geometry';

interface Props {
  technique: Technique;
  size: number;
  selected: boolean;
}

// Small preview of a technique's shape, with the dot at the starting corner
export default function ShapeIcon({ technique, size, selected }: Props) {
  const geometry = useMemo(
    () =>
      fitShape(
        buildShape(
          technique.shape,
          technique.phases.map((p) => p.ms),
        ),
        size,
        size,
        5,
      ),
    [technique, size],
  );
  const start = pointAt(geometry.edges[0], 0);

  return (
    <Svg width={size} height={size} opacity={selected ? 1 : 0.35}>
      <Path
        d={pathOf(geometry)}
        fill={selected ? 'rgba(155, 127, 212, 0.12)' : 'none'}
        stroke={COLORS.borderPurple}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx={start.x} cy={start.y} r={3.5} fill={COLORS.dot} />
    </Svg>
  );
}
