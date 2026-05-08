import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import PulsingButton from '../components/PulsingButton';
import { COLORS } from '../constants/breathing';

export default function StartScreen() {
  const router = useRouter();
  const screenOpacity = useSharedValue(1);

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
    router.replace('/breathing');
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
        <Text style={styles.title}>Box Breathing 4min</Text>
        <View style={styles.buttonContainer}>
          <PulsingButton onPress={handlePress} />
        </View>
        <Text style={styles.hint}>Tap to begin / Appuyer pour commencer</Text>
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
  },
  title: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: '200',
    marginBottom: 80,
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
});
