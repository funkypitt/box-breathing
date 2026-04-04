import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/breathing';

interface Props {
  elapsedMs: number;
}

export default function Timer({ elapsedMs }: Props) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return <Text style={styles.timer}>{display}</Text>;
}

const styles = StyleSheet.create({
  timer: {
    color: COLORS.text,
    opacity: 0.6,
    fontSize: 20,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 60,
  },
});
