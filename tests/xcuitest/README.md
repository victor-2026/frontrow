# XCUITest (iOS UI tests)

These tests target the running FrontRow React Native app on iOS. testIDs become iOS `accessibilityIdentifier`s, so the same identifiers we use in `src/testIds.ts` work directly with XCUITest.

## How to run

These files are templates. To execute them you need a UI Test target inside the Xcode project:

1. Open `ios/FrontRow.xcworkspace` in Xcode.
2. **File → New → Target… → UI Testing Bundle.** Name it `FrontRowUITests`.
3. Replace the auto-generated `FrontRowUITests.swift` with the contents of `tests/xcuitest/FrontRowUITests.swift`.
4. Run with **Product → Test (⌘U)** or from the CLI:

```bash
cd ios
xcodebuild test \
  -workspace FrontRow.xcworkspace \
  -scheme FrontRow \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -only-testing:FrontRowUITests
```

## Convention

- Swift only.
- One test class per feature.
- Match elements by `app.<element>["<testID>"]`, e.g. `app.buttons["eventDetail.buyButton"]`.
- Where text matching is unavoidable (system Alert dialogs), prefer `app.alerts.element.buttons["OK"]`.
