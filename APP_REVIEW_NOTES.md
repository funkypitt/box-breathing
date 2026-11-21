# App Review Notes - 4 Minutes Breathing 2.2.0 (7)

## Purpose and audience
4 Minutes Breathing is a simple general-wellbeing app for adults who want a short, guided breathing break. The user picks one of five classic paced-breathing patterns and follows a dot moving around a shape for four minutes. It is NOT a medical device: it makes no diagnosis, treatment or therapeutic claim, measures nothing about the body and collects no health data. The techniques are traditional, public-domain breathing patterns (box breathing, Dr Andrew Weil's 4-7-8 breath, coherent breathing / "cardiac coherence", a 3-3-6 long exhale, a 4-4-4 triangle); the app only times them.

## How to use the main features (no login required)
1. Launch the app: the start screen opens directly. No account, sign-up or onboarding.
2. Tap one of the five shapes (square, triangle, long triangle, petal, circle) to choose a technique; its name and rhythm appear below.
3. Optional: tick "Sound at each phase" to hear a soft note at each phase change (a sample note plays when ticked). The setting is remembered on the device.
4. Tap the pulsing button: the session starts. A dot travels around the shape; prompts read "Breathe in / Hold / Breathe out" (English and French). The screen stays awake.
5. Box breathing only: at the 2-minute mark "Slowing down..." appears and the pace goes from 3 s to 4 s.
6. After about four minutes (always ending on a complete breath) "Well done! / Bravo !" appears and the app returns to the start screen automatically.
There are no other screens, no in-app purchases, no ads and no external links.

## External services
None. The app makes no network requests and contains no analytics, crash reporting, advertising, authentication, payment, cloud or AI service. It works fully offline. The only stored data is the on/off sound preference, kept locally on the device (AsyncStorage) and never transmitted. No permissions are requested (no microphone, camera, location, notifications or tracking). ITSAppUsesNonExemptEncryption = NO.

## Regional differences
The app is identical in every country and region; no feature or content depends on location. The interface is bilingual: every on-screen text is shown in English and French at the same time.
Mainland China: [CHOOSE: "The app is not distributed in mainland China." OR "<details of the security assessment / filing provided for mainland China>"] (suggested default: remove mainland China from availability).

## Third-party material
- Sounds, both CC0 1.0 (public domain dedication), from Freesound:
  - Kalimba note "G4 soft" by hollandm - https://freesound.org/s/691805/ (pitched to three notes, lightly denoised)
  - Crystal bell by arseniiv - https://freesound.org/s/614832/
- Fonts: iOS system font only; no bundled fonts.
- Icon, shapes and all graphics: original work by the developer (drawn in code with react-native-svg).
- Code libraries: open-source (Expo, React Native and their MIT-licensed modules). The app's own source is GPL-3.0 and public: https://github.com/funkypitt/box-breathing
- Breathing techniques: public-domain practices; no third-party text, brand or protected content is reproduced.
- The app is not in a regulated sector (no medical, financial, gambling or similar functions).

## Screen recording
Attached: a screen recording made on a physical iPhone, starting from launch and showing technique selection, the sound option, a breathing session and its automatic end.
