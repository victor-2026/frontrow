# Maestro Flows

End-to-end flows authored in Maestro YAML.

## Running locally

```bash
# Install Maestro: https://maestro.mobile.dev/
maestro test tests/maestro/smoke/launch.yaml      # single flow
./scripts/maestro.sh android                      # full suite (auto-retry)
./scripts/maestro.sh ios
```

## What's covered

| Folder          | Flows                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `smoke/`        | `launch`, `onboarding-complete`, `onboarding-skip`                                                                                    |
| `events/`       | `browse`, `pagination`, `reviews`, `favorites`, `follow-artist`, `genre-filter`, `lineup`, `recently-viewed`, `refund-policy`, `sort` |
| `auth/`         | `login`, `forgotPassword`, `recovery-deeplinks`, `edit-profile`, `language-switch`                                                    |
| `tickets/`      | `buy`, `tier-select`, `detail-cancel` (android-only), `transfer` (android-only)                                                       |
| `billing/`      | `buy-success`, `buy-decline`, `payment-methods-crud`                                                                                  |
| `debug/`        | `failure-trigger` (android-only)                                                                                                      |
| `capabilities/` | `haptic`                                                                                                                              |
| `native/`       | `native-demo` — opens the bridged Swift/Kotlin screen and exercises its testID contract                                               |

Three flows are tagged `android-only` because they rely on Maestro reading testIDs inside an RN `<Modal>` on iOS, which surfaces inconsistently. The scripts/maestro.sh wrapper excludes them automatically when `PLATFORM=ios`. Their underlying logic is unit-tested.

## Convention

- One YAML file per scenario.
- Group scenarios by feature in subdirectories: `auth/`, `events/`, `tickets/`, `billing/`, `debug/`, `smoke/`, `capabilities/`.
- Use `id:` matchers against the IDs in `src/testIds.ts`. Never match by visible text alone, except for system dialogs (Alert.alert "Delete" / "Open") where the label is the only stable selector.
- Scenarios that need specific app state should `launchApp` with `clearState: true` and then either drive through the UI or open a `frontrow://debug/seed/<id>` deep link.
- Hardware keyboard quirks: iOS simulators surface a hardware keyboard so `hideKeyboard` errors. Wrap it in `runFlow.when.platform: Android` or omit it on iOS.

## Fast-boot for E2E

Every cold launch on emulator costs ~5–15s for the JS bundle to load,
plus another 2–5s of UI taps if the flow needs an authenticated user.
Across the ~28 flow suite that compounds into several minutes of pure
overhead per run.

Two patterns reduce this:

1. **Use `_setup.yaml` instead of duplicating login flows.**

   ```yaml
   appId: app.frontrow.qa
   ---
   - runFlow: ../_setup.yaml
   # ... your flow body ...
   ```

   `_setup.yaml` does one cold launch, fires the
   `frontrow://e2e/setup` deep link, and returns to the events screen
   with the demo user signed in, onboarding marked complete, mock
   state reset, and triggers cleared. Replaces ~7 taps + 5s of UI
   navigation with one openLink (~200ms). The `_` prefix keeps it out
   of the auto-discovered flow globs in `config.yaml`.

2. **Trim wait timeouts.** Default `extendedWaitUntil` for cold launch
   is now 20000ms, not 60000. A healthy cold boot returns in ~3s; the
   60s ceiling only ever burned time on a stuck flow before reporting
   failure.

When _not_ to use `_setup.yaml`:

- Flows that explicitly test the cold-launch path (`smoke/launch`).
- Flows that test the onboarding UI (`smoke/onboarding-*`).
- Flows that test the login UI itself (`auth/login`,
  `auth/forgotPassword`, `auth/recovery-deeplinks`).

For everything else (tickets, events, billing, profile, debug,
capabilities), prefer `_setup.yaml`.

## What else is slow, and what we don't (yet) optimize

- **Maestro JVM cold start (~20s).** Maestro spawns a JVM per
  invocation. Running individual flows from CI repeatedly is wasteful
  — prefer `maestro test tests/maestro/` (one JVM, all flows).
- **Single-device sequential execution.** Maestro Cloud supports
  parallel device fan-out; locally we're stuck with one emulator.
  When the suite gets bigger, push the long tail to Maestro Cloud or
  Sauce/BrowserStack and keep only the smoke tier on the local
  emulator.
- **Dev bundle vs production bundle.** A production-mode JS bundle
  (`expo run:android --variant release`) is ~2× faster to load than
  the dev bundle. Reserve dev mode for debugging; ship release builds
  to the test loop.
- **`scrollUntilVisible` on the debug screen.** The screen has 13
  sections — pulls to the bottom take ~3–8s. If a flow only needs to
  toggle a trigger or apply a scenario, prefer the corresponding
  deep link (`frontrow://debug/trigger/<kind>[/on|/off]`,
  `frontrow://debug/seed/<id>`) over scrolling and tapping.
