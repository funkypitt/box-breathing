import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import PulsingButton from '../components/PulsingButton';
import ShapeIcon from '../components/ShapeIcon';
import { COLORS, TECHNIQUES, DEFAULT_TECHNIQUE } from '../constants/breathing';
import { loadSounds, saveSounds } from '../constants/settings';
import { playCue, prepareSounds } from '../constants/sounds';

const ICON_SIZE = 52;

export default function StartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const screenOpacity = useSharedValue(1);
  const [technique, setTechnique] = useState(DEFAULT_TECHNIQUE);
  const [sounds, setSounds] = useState(false);

  useEffect(() => {
    loadSounds().then((on) => {
      setSounds(on);
      if (on) prepareSounds();
    });
  }, []);

  // The tick plays its own note once, so the volume can be judged before starting.
  const toggleSounds = () => {
    const on = !sounds;
    setSounds(on);
    saveSounds(on);
    if (on) playCue('hold');
  };

  const handlePress = () => {
    screenOpacity.value = withTiming(
      0,
      { duration: 800, easing: Easing.out(Easing.ease) },
      (finished) => {
        if (finished) {
          runOnJS(navigate)();
        }
      },
    );
  };

  const navigate = () => {
    router.replace({ pathname: '/breathing', params: { technique: technique.id, sounds: sounds ? '1' : '0' } });
  };

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <LinearGradient
      colors={[COLORS.bgTop, COLORS.bgBottom]}
      style={styles.gradient}
    >
      <Animated.View style={[styles.container, fadeStyle]}>
        <Text style={styles.title}>4 Minutes Breathing</Text>

        {/* Pick a shape: each one is a technique */}
        <View style={styles.shapeRow}>
          {TECHNIQUES.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTechnique(t)}
              style={styles.shapeCell}
              accessibilityLabel={`${t.name.en} ${t.rhythm}`}
            >
              <ShapeIcon technique={t} size={ICON_SIZE} selected={t.id === technique.id} />
              <Text style={[styles.rhythm, t.id === technique.id && styles.rhythmSelected]}>
                {t.rhythm.replace(/ /g, '')}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.chosen}>
          <Text style={styles.nameEn}>{technique.name.en}</Text>
          <Text style={styles.nameFr}>{technique.name.fr}</Text>
          <Text style={styles.note}>
            {technique.note.en} · {technique.note.fr}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <PulsingButton onPress={handlePress} />
        </View>
        <Text style={styles.hint}>Tap to begin / Appuyer pour commencer</Text>

        {/* One option: a soft note at each change of phase, for breathing in the dark */}
        <Pressable
          onPress={toggleSounds}
          style={styles.tickRow}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: sounds }}
          accessibilityLabel="Sound at each phase / Son à chaque phase"
        >
          <View style={[styles.tickBox, sounds && styles.tickBoxOn]}>
            {sounds && <Text style={styles.tickMark}>✓</Text>}
          </View>
          <Text style={[styles.tickLabel, sounds && styles.tickLabelOn]}>
            Sound at each phase · Son à chaque phase
          </Text>
        </Pressable>
        <Text style={[styles.credits, { bottom: 24 + insets.bottom }]}>Pierre Gallaz · developed with Claude Code</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: '200',
    marginBottom: 44,
  },
  shapeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shapeCell: {
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 4,
  },
  rhythm: {
    color: COLORS.text,
    opacity: 0.3,
    fontSize: 11,
    fontWeight: '300',
    marginTop: 6,
  },
  rhythmSelected: {
    opacity: 0.8,
  },
  chosen: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 44,
    minHeight: 76,
  },
  nameEn: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '300',
  },
  nameFr: {
    color: COLORS.text,
    opacity: 0.6,
    fontSize: 16,
    fontWeight: '300',
    marginTop: 2,
  },
  note: {
    color: COLORS.text,
    opacity: 0.4,
    fontSize: 12,
    fontWeight: '300',
    marginTop: 8,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  hint: {
    color: COLORS.text,
    opacity: 0.4,
    fontSize: 14,
    fontWeight: '300',
  },
  tickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tickBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.borderPurple,
    opacity: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  tickBoxOn: {
    opacity: 1,
    backgroundColor: COLORS.purple,
  },
  tickMark: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '600',
  },
  tickLabel: {
    color: COLORS.text,
    opacity: 0.4,
    fontSize: 13,
    fontWeight: '300',
  },
  tickLabelOn: {
    opacity: 0.8,
  },
  credits: {
    position: 'absolute',
    bottom: 24,
    color: COLORS.text,
    opacity: 0.25,
    fontSize: 11,
    fontWeight: '300',
  },
});
