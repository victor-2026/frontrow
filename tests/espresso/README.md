# Espresso (Android instrumentation) tests

These tests target the running FrontRow React Native app on Android. testIDs become Android `resource-id`s, so the same identifiers we use in `src/testIds.ts` work directly with Espresso.

## How to run

These files are templates. To execute them they must live under the Android project's instrumentation source set:

```bash
mkdir -p android/app/src/androidTest/java/app/frontrow/qa
cp tests/espresso/*.kt android/app/src/androidTest/java/app/frontrow/qa/
cd android
./gradlew :app:connectedAndroidTest
```

Run against an emulator or device that already has FrontRow installed (`npm run android` once first).

## Convention

- Kotlin only.
- One test class per feature (`SmokeEspressoTest.kt`, `EventsBrowseEspressoTest.kt`, etc.).
- Match elements by `withResourceName(...)` against the IDs in `src/testIds.ts`.
- For text matching, prefer the testID path; fall back to `withText` only when an element has no ID.
