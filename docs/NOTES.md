# 4 Minutes Breathing — notes

## Compilation

Le dossier `android/` est régénéré par Expo (`npx expo prebuild --platform android
--clean --no-install`) et n'est pas versionné. Depuis 2.2.0, tout ce qui le configure
vit dans `app.json` et survit à la régénération :

- `expo-build-properties` : compileSdk / targetSdk 36, build-tools 36.0.0, une seule
  architecture (`arm64-v8a`), minification et réduction des ressources en release
  (APK de 77 Mo à 25 Mo ; les téléphones 32 bits et les émulateurs x86 ne peuvent
  plus installer l'APK — pour un essai sur émulateur, ajouter `"x86_64"` à
  `buildArchs` le temps de l'essai, ou passer `-PreactNativeArchitectures=arm64-v8a,x86_64`
  à Gradle) ;
- `android.blockedPermissions` : le micro et le service de premier plan déclarés par
  expo-audio, le stockage externe, la superposition et la vibration du gabarit Expo,
  dont l'appli ne se sert pas ;
- `version` et `android.versionCode` : la source de vérité pour la version.

Reste à créer à la main après chaque régénération, sinon Gradle ne trouve pas le SDK :

    android/local.properties :  sdk.dir=/chemin/vers/Android/Sdk

Puis :

    cd android && ./gradlew assembleRelease bundleRelease
