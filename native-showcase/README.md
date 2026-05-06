# Native showcase

A pair of hand-rolled native screens — one Swift `UIViewController`, one
Kotlin `Activity` — bridged into the React Native shell so QA can
exercise authentic native targets with Espresso (Android) and XCUITest
(iOS). The whole point: prove that the same `testID` contract used by
the JS-driven screens carries over to native code.

This directory ships as a **scaffold**. The files compile and the tests
target the right symbols, but they aren't wired into the live `ios/` and
`android/` projects automatically — Expo prebuild owns those folders and
arbitrary additions get clobbered by the next prebuild. The wiring
instructions below explain how to opt in safely.

## What's in here

```
native-showcase/
├── ios/
│   ├── FrontRowNativeDemoViewController.swift   # the screen
│   └── FrontRowNativeDemoModule.swift           # RCTBridgeModule wrapper
├── android/com/frontrow/nativedemo/
│   ├── NativeDemoActivity.kt                    # the screen
│   ├── NativeDemoModule.kt                      # ReactContextBaseJavaModule
│   └── NativeDemoPackage.kt                     # ReactPackage registration
└── tests/
    ├── espresso/NativeDemoActivityTest.kt       # Espresso target
    └── xcuitest/NativeDemoTests.swift           # XCUITest target
```

## How testIDs map to native code

| Layer        | RN testID prop | Native attribute                                  |
| ------------ | -------------- | ------------------------------------------------- |
| iOS (UIKit)  | n/a            | `accessibilityIdentifier`                         |
| Android view | n/a            | `contentDescription` (or `setTag` with view-id)   |

The native code in this directory sets those attributes manually so the
XCUITest queries (`app.buttons["nativeDemo.incrementButton"]`) and
Espresso matchers (`onView(withContentDescription("nativeDemo.title"))`)
match the same string used in `src/testIds.ts`.

## Wiring it up — iOS

1. Drag `ios/FrontRowNativeDemoViewController.swift` and
   `ios/FrontRowNativeDemoModule.swift` into the Xcode project under the
   `FrontRow` group.
2. Add the bridge declaration to `ios/FrontRow/FrontRow-Bridging-Header.h`:
   ```objc
   #import <React/RCTBridgeModule.h>
   ```
3. Append the module declaration in either a new `.m` file or via
   `@objc` exposure (already on the Swift class). React Native's
   autolink picks it up via `RCT_EXTERN_METHOD`.
4. Add the test target file `tests/xcuitest/NativeDemoTests.swift` to
   the existing `FrontRowUITests` target (Xcode → Edit Scheme → Test).
5. Re-run `npx expo prebuild --clean` is **not** safe afterwards — it
   would wipe these manual additions. Track them in a config plugin
   instead: see [Expo config plugin](https://docs.expo.dev/config-plugins/introduction/)
   for the long-term path.

## Wiring it up — Android

1. Copy the `com/frontrow/nativedemo/` tree into
   `android/app/src/main/java/`.
2. Register the package in `android/app/src/main/java/app/frontrow/qa/MainApplication.kt`:
   ```kotlin
   override fun getPackages(): List<ReactPackage> {
     val packages = PackageList(this).packages
     packages.add(NativeDemoPackage())
     return packages
   }
   ```
3. Add `<activity android:name="com.frontrow.nativedemo.NativeDemoActivity" />`
   inside `<application>` in `android/app/src/main/AndroidManifest.xml`.
4. Drop `NativeDemoActivityTest.kt` into
   `android/app/src/androidTest/java/com/frontrow/nativedemo/`.
5. Run `./gradlew connectedAndroidTest` from `android/`.

## How to call it from RN

Once wired, expose the module from JS:

```ts
import { NativeModules, Platform } from 'react-native';

export function openNativeDemo(): void {
  if (NativeModules.FrontRowNativeDemo?.open) {
    NativeModules.FrontRowNativeDemo.open();
  } else if (__DEV__) {
    console.warn('FrontRowNativeDemo is not registered on this platform.');
  }
}
```

Then add a button to `DebugScreen.tsx`:

```tsx
<Row
  testID="debug.openNativeDemo"
  label="Open native demo"
  onPress={openNativeDemo}
/>
```

The XCUITest scaffold (`testNativeDemoOpens_AndIncrementUpdatesCounter`)
already targets the `debug.openNativeDemo` testID, so the test goes
green the moment the wiring is complete.

## Why this isn't autolinked

The Expo prebuild flow regenerates `ios/` and `android/` from a config
plugin pipeline. Adding files directly is fine for a one-off but doesn't
survive a `--clean` prebuild. The proper path is to author this as a
config plugin in `app.config.ts` so the prebuild step copies these
files into the right locations on every regenerate. That's deferred to a
follow-up — this scaffold is the prototype.
