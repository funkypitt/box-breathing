![Box Breathing 4min](docs/banner.png)

# Box Breathing 4min

**FR** — Suivez le point autour d'un carré : inspirez, retenez, expirez, retenez. Quatre minutes, d'un rythme de 3 secondes à 4 secondes à mi-parcours. Aucun réglage, aucune série à tenir, aucun compte, aucun pistage.

**EN** — Follow the guide round a square: breathe in, hold, out, hold. Four minutes, from a 3-second rhythm to 4 seconds halfway. No settings, no streaks, no account, no tracking.

## Key points

- One button: tap to begin. The session lasts four minutes and returns to the start
  screen by itself.
- Halfway, a "Slowing down…" message marks the change from 3 to 4 seconds per side.
- Prompts are shown in English and French together; there is no language setting.
- The screen stays on during the session.
- Nothing is stored and nothing leaves the phone; works offline.

## Install


[<img src="docs/badge_obtainium.png" alt="Get it on Obtainium" height="48">](https://gallaz.ch/eink/#obtainium)

- **F-Droid** (recommended, updates arrive by themselves): add the repository from [gallaz.ch/eink](https://gallaz.ch/eink/#fdroid), or the address `https://funkypitt.github.io/fdroid-repo/repo` in F-Droid.
- **Obtainium**: tap the badge on the phone, or add `https://github.com/funkypitt/box-breathing` in Obtainium.
- **APK**: attached to the [latest release](../../releases/latest). No automatic updates.

All three deliver the same file, with the same signature.

## Build

Expo / React Native (managed workflow, expo-router).

```
npm install
npx expo prebuild --platform android --clean
cd android && ./gradlew assembleRelease
```

`prebuild --clean` regenerates `android/` and discards the settings that keep the APK
at 25 MB (arm64 only, minify, shrink) and `local.properties`: reapply them from
[docs/NOTES.md](docs/NOTES.md) before `assembleRelease`. `app.json` holds the version.

For iOS, see `DEPLOY.md` for the Codemagic pipeline.

## Crédits / Credits

© 2026 Pierre Gallaz. Développé avec [Claude Code](https://claude.com/claude-code) (Anthropic).
Licence GPL-3.0-only, voir `LICENSE`.

© 2026 Pierre Gallaz. Developed with [Claude Code](https://claude.com/claude-code) (Anthropic).
GPL-3.0-only licence, see `LICENSE`.
