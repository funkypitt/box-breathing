# Box Breathing 4min — notes

## Compilation

Le dossier `android/` est régénéré par Expo (`npx expo prebuild`) et n'est pas
versionné : les réglages ci-dessous sont à réappliquer après chaque régénération.

1. `android/local.properties` — indispensable, sinon Gradle ne trouve pas le SDK :

       sdk.dir=/chemin/vers/Android/Sdk

2. `android/gradle.properties` — APK de 77 Mo à 25 Mo :

       reactNativeArchitectures=arm64-v8a
       android.enableMinifyInReleaseBuilds=true
       android.enableShrinkResourcesInReleaseBuilds=true

   La première ligne ne garde que les bibliothèques 64 bits ; les trois autres
   familles de processeurs pesaient 48 Mo. Les deux suivantes réduisent le code.
   Conséquence : les téléphones 32 bits et les émulateurs x86 ne peuvent plus
   installer l'APK. Pour tester sur émulateur, ajouter `,x86_64` à la première
   ligne le temps de l'essai.

3. `app.json` reste la source de vérité pour la version (`version` et
   `android.versionCode`), puisque `android/app/build.gradle` est régénéré.

       cd android && ./gradlew assembleRelease
