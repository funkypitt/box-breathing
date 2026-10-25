import AsyncStorage from '@react-native-async-storage/async-storage';

const SOUNDS_KEY = 'sounds';

// One choice is kept between sessions: whether the phases are marked by a sound.
export async function loadSounds(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(SOUNDS_KEY)) === '1';
  } catch {
    return false;
  }
}

export async function saveSounds(on: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(SOUNDS_KEY, on ? '1' : '0');
  } catch {
    // nothing to do: the choice simply lasts for this session
  }
}
