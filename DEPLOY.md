# Box Breathing 4min — App Store Deployment Guide

## 1. Store Listings

### Google Play Store

**App name:** Box Breathing 4min

**Short description (80 chars max):**
> Minimalist 4-minute guided box breathing exercise. No ads, no tracking.

**Full description:**
```
Box Breathing 4min is a free, open-source breathing exercise app designed to help you
relax in just 4 minutes.

Follow the glowing dot around a square: breathe in, hold, breathe out, hold.
The session starts with a gentle 3-second rhythm and naturally transitions to
4 seconds halfway through, guiding you into deeper calm.

Features:
• Simple, distraction-free interface
• Smooth 60fps animations
• Progressive rhythm (3s → 4s)
• Bilingual instructions (English / French)
• Screen stays awake during exercise
• No accounts, no ads, no tracking, no internet required

Box breathing (also called square breathing) is a technique used by Navy SEALs,
athletes, and therapists to reduce stress, improve focus, and regulate the
nervous system.

Open source: https://github.com/funkypitt/box-breathing
```

**Category:** Health & Fitness
**Content rating:** Everyone
**Tags:** breathing, meditation, relaxation, stress relief, mindfulness

---

### Apple App Store

**App name:** Box Breathing 4min

**Subtitle (30 chars max):**
> Guided 4-minute calm exercise

**Promotional text (170 chars max):**
> A minimalist breathing exercise: follow the dot around the square. 4 minutes to calm your mind. No ads, no tracking.

**Description:**
```
Box Breathing 4min is a free, open-source breathing exercise app designed to help you relax in just 4 minutes.

Follow the glowing dot around a square: breathe in, hold, breathe out, hold. The session starts with a gentle 3-second rhythm and naturally transitions to 4 seconds halfway through, guiding you into deeper calm.

FEATURES
• Simple, distraction-free interface
• Smooth 60fps animations
• Progressive rhythm (3s → 4s)
• Bilingual instructions (English / French)
• Screen stays awake during exercise
• No accounts, no ads, no tracking, no internet required

Box breathing (also called square breathing) is a technique used by Navy SEALs, athletes, and therapists to reduce stress, improve focus, and regulate the nervous system.

Open source: https://github.com/funkypitt/box-breathing
```

**Keywords (100 chars max):**
```
breathing,box,meditation,relax,stress,calm,mindfulness,exercise,focus,sleep
```

**Category:** Health & Fitness
**Secondary category:** Lifestyle
**Privacy URL:** https://github.com/funkypitt/box-breathing (no data collected)
**Support URL:** https://github.com/funkypitt/box-breathing/issues

---

## 2. Required Assets

### Screenshots (to create)

Take screenshots on a real device or emulator at these sizes:

| Platform | Size | Quantity |
|----------|------|----------|
| Android Phone | 1080×1920 or 1080×2340 | 4-8 |
| Android Tablet (7") | 1200×1920 | 2+ (optional) |
| Android Tablet (10") | 1600×2560 | 2+ (optional) |
| iPhone 6.7" (15 Pro Max) | 1290×2796 | 4-8 |
| iPhone 6.5" (11 Pro Max) | 1242×2688 | 4-8 |
| iPad Pro 12.9" | 2048×2732 | 2+ (if supporting iPad) |

**Suggested screenshots:**
1. Start screen (with pulsing button)
2. Breathing screen — "Breathe in / Inspire" phase
3. Breathing screen — "Hold / Retiens" phase (dot at top)
4. Breathing screen — "Breathe out / Expire" phase
5. "Well done / Bravo !" end screen

### Icons

Already generated in `assets/`:
- `icon.png` (1024×1024) — used for both stores
- `adaptive-icon.png` (1024×1024) — Android adaptive icon

### Google Play Feature Graphic

Required: 1024×500 PNG or JPG.
Create a simple graphic with the dark gradient background, the square+dot icon centered, and "Box Breathing 4min" text.

---

## 3. Pre-deployment Checklist

### Apple Developer Account
- [ ] Enrolled in Apple Developer Program ($99/year)
- [ ] Create App ID `com.boxbreathing.app` in Certificates, Identifiers & Profiles
- [ ] Create the app in App Store Connect (bundle ID: `com.boxbreathing.app`)

### Google Play Console
- [ ] App already created? If not, create it (package: `com.boxbreathing.app`)
- [ ] Service account `codemagic-publish@enpleineconscience.iam.gserviceaccount.com` has access to the new app
  - Go to Google Play Console → Settings → API access → grant the service account "Release manager" role for this app

### Codemagic
- [ ] Add the `box-breathing` GitHub repo to Codemagic
- [ ] Verify these existing configs are accessible:
  - Android signing: `android-key-lm`
  - Credential group: `google_play_credentials`
  - App Store Connect integration: `codemagic`
- [ ] Copy `codemagic.yaml` to the repo root (see section 4)

---

## 4. Codemagic YAML Configuration

```yaml
workflows:
  android-release:
    name: Android Release
    max_build_duration: 60
    instance_type: linux_x2
    environment:
      android_signing:
        - android-key-lm
      groups:
        - google_play_credentials
      vars:
        PACKAGE_NAME: "com.boxbreathing.app"
      node: 18
      java: 21
    scripts:
      - name: Install dependencies
        script: npm install
      - name: Generate native Android project
        script: npx expo prebuild --platform android --clean
      - name: Set Android SDK location
        script: echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
      - name: Inject signing config into build.gradle
        script: |
          GRADLE_FILE="$CM_BUILD_DIR/android/app/build.gradle"
          sed -i '/buildTypes {/i \
              signingConfigs {\
                  release {\
                      if (System.getenv("CI")) {\
                          storeFile file(System.getenv("CM_KEYSTORE_PATH"))\
                          storePassword System.getenv("CM_KEYSTORE_PASSWORD")\
                          keyAlias System.getenv("CM_KEY_ALIAS")\
                          keyPassword System.getenv("CM_KEY_PASSWORD")\
                      }\
                  }\
              }' "$GRADLE_FILE"
          sed -i '/buildTypes {/,/release {/ {
            /release {/a \
                signingConfig signingConfigs.release
          }' "$GRADLE_FILE"
      - name: Build AAB
        script: |
          cd android
          ./gradlew bundleRelease
    artifacts:
      - android/app/build/outputs/**/*.aab
    publishing:
      google_play:
        credentials: $GOOGLE_PLAY_SERVICE_ACCOUNT_CREDENTIALS
        track: beta
        changes_not_sent_for_review: true

  ios-release:
    name: iOS Release
    max_build_duration: 90
    instance_type: mac_mini_m2
    integrations:
      app_store_connect: codemagic
    environment:
      ios_signing:
        distribution_type: app_store
        bundle_identifier: com.boxbreathing.app
      vars:
        XCODE_SCHEME: "BoxBreathing"
      node: 18
      xcode: latest
      cocoapods: default
    scripts:
      - name: Install dependencies
        script: npm install
      - name: Generate native iOS project
        script: npx expo prebuild --platform ios --clean
      - name: Install CocoaPods
        script: cd ios && pod install
      - name: Disable non-exempt encryption flag
        script: |
          PLIST="$CM_BUILD_DIR/ios/$XCODE_SCHEME/Info.plist"
          /usr/libexec/PlistBuddy -c \
            "Add :ITSAppUsesNonExemptEncryption bool false" "$PLIST" || true
      - name: Set up code signing
        script: xcode-project use-profiles --warn-only
      - name: Build IPA
        script: |
          xcode-project build-ipa \
            --workspace "$CM_BUILD_DIR/ios/$XCODE_SCHEME.xcworkspace" \
            --scheme "$XCODE_SCHEME"
    artifacts:
      - build/ios/ipa/*.ipa
      - /tmp/xcodebuild_logs/*.log
    publishing:
      app_store_connect:
        auth: integration
        submit_to_testflight: true
```

---

## 5. Step-by-step Deployment

### Step 1 — Add codemagic.yaml to the repo

Copy the YAML config above into `codemagic.yaml` at the project root, commit and push:

```bash
git add codemagic.yaml
git commit -m "Add Codemagic CI/CD configuration"
git push
```

### Step 2 — Google Play Console setup

1. Go to https://play.google.com/console
2. **Create app** → name: "Box Breathing 4min", free, Health & Fitness
3. Fill in the store listing (descriptions above), upload screenshots and icon
4. **Setup → API access** → ensure service account `codemagic-publish@enpleineconscience.iam.gserviceaccount.com` has access
5. **Content rating** → fill questionnaire (no violence, no ads, etc.)
6. **Pricing & distribution** → Free, all countries
7. **App content** → Privacy policy URL, ads declaration (no ads), target audience (everyone)

### Step 3 — App Store Connect setup

1. Go to https://appstoreconnect.apple.com
2. **My Apps → +** → name: "Box Breathing 4min", bundle ID: `com.boxbreathing.app`, SKU: `box-breathing`
3. Fill in the App Information:
   - Subtitle, description, keywords, URLs (see section 1)
   - Category: Health & Fitness
   - Privacy: "Data Not Collected"
4. **Pricing** → Free
5. In Apple Developer portal:
   - Register the App ID `com.boxbreathing.app` if not already done
   - Codemagic manages provisioning profiles automatically via the App Store Connect API key

### Step 4 — Trigger builds on Codemagic

1. Go to https://codemagic.io/apps
2. Add the repo `funkypitt/box-breathing` (if not already added)
3. Select workflow: **Android Release** → Start build
4. Select workflow: **iOS Release** → Start build
5. Android AAB will be pushed to Google Play beta track
6. iOS IPA will be submitted to TestFlight

### Step 5 — Review and publish

**Google Play:**
1. Go to Play Console → Box Breathing 4min → Release → Testing → Open testing
2. Promote the beta build to Production
3. Submit for review (usually 1-3 days)

**App Store:**
1. Go to App Store Connect → Box Breathing 4min → App Store tab
2. Select the TestFlight build for the release
3. Upload screenshots for required device sizes
4. Submit for review (usually 1-2 days)

---

## 6. Version Bumping for Future Updates

Before each release, bump both values in `app.json`:

```json
{
  "version": "1.2.0",        ← human-readable version
  "android": {
    "versionCode": 3          ← must increment for each Play Store upload
  }
}
```

iOS uses `version` for CFBundleShortVersionString and auto-generates the build number.

---

## 7. Notes

- **XCODE_SCHEME**: After `expo prebuild`, the iOS scheme name is derived from the `name` field in `app.json`. With `"name": "Box Breathing 4min"`, the scheme will be `Box Breathing 4min`. If this causes issues with spaces, rename it to `BoxBreathing4min` in `app.json` for the iOS build. Adjust `XCODE_SCHEME` in the YAML accordingly.
- **Gradle version**: If the build fails with a Gradle/JVM error (like Antithèse had with SDK 55), pin Gradle to a stable version by adding a step before the build:
  ```bash
  sed -i 's|gradle-.*-bin\.zip|gradle-8.13-bin.zip|' \
    "$CM_BUILD_DIR/android/gradle/wrapper/gradle-wrapper.properties"
  ```
- **Signing key**: All your apps share `android-key-lm`. This is fine — Google Play uses upload key + app signing, so the same upload key works across apps.
- **App Store Connect API key**: Already configured (Key ID: `95P5D5J7DT`, Issuer ID: `69a6de88-c347-47e3-e053-5b8c7c11a4d1`). Codemagic handles this via the `codemagic` integration.
