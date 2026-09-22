![4 Minutes Breathing](docs/banner.png)

# 4 Minutes Breathing

**FR** — Choisissez une forme et suivez le point autour d'elle pendant quatre minutes : carré (4-4-4-4), triangle (4-4-4), 4-7-8, pétale (3-3-6), cercle (cohérence cardiaque 5-5). Aucun réglage, aucune série à tenir, aucun compte, aucun pistage.

**EN** — Pick a shape and follow the dot round it for four minutes: square (box 4-4-4-4), triangle (4-4-4), 4-7-8, petal (3-3-6), circle (coherent 5-5). No settings, no streaks, no account, no tracking.

Formerly *Box Breathing 4min*; the box is now one of five techniques.

## Key points

- One screen: pick a shape, tap the button. The session lasts four minutes, ends on a
  complete breath, and returns to the start screen by itself.
- The shapes respect the durations: every edge is as long as the breath it stands for
  (`constants/geometry.ts`). A 3-3-6 triangle would be flat, so the petal's exhale is a
  circular arc of exactly twice the straight edges.
- Box breathing keeps its progressive rhythm: 3 seconds per side, then 4 halfway,
  with a "Slowing down…" message.
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
npm ci --legacy-peer-deps
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
