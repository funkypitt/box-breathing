# Box Breathing 4min

**FR** — Appli de respiration carrée calme et sans distraction. Suivez le point lumineux autour d'un carré : inspirez, retenez, expirez, retenez. La séance de 4 minutes commence sur un rythme de 3 secondes et passe doucement à 4 secondes à mi-parcours. Instructions bilingues (français / anglais), écran maintenu allumé, aucun compte, aucune pub, aucun pistage, aucune connexion requise.

**EN** — A calm, distraction-free box-breathing app: follow the glowing dot around a square (breathe in, hold, breathe out, hold). The 4-minute session opens at a 3-second rhythm and eases to 4 seconds halfway through. Bilingual prompts, screen stays awake, no accounts, no ads, no tracking, fully offline.

## Build

Expo / React Native (managed workflow, expo-router).

```
npm install
npx expo prebuild --platform android --clean
cd android && ./gradlew assembleRelease
```

For iOS, see `DEPLOY.md` for the Codemagic pipeline.

## Install

Install the generated APK on an Android device, or grab it from the author's F-Droid repository.

## Crédits / Credits

© 2026 Pierre Gallaz. Développé avec [Claude Code](https://claude.com/claude-code) (Anthropic).
Licence GPL-3.0-only, voir `LICENSE`.

© 2026 Pierre Gallaz. Developed with [Claude Code](https://claude.com/claude-code) (Anthropic).
GPL-3.0-only licence, see `LICENSE`.
