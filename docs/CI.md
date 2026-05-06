# Continuous integration

FrontRow targets two CI tiers:

1. **Free, contributor-friendly** — runs on every PR, no secrets required.
2. **Cloud labs (opt-in)** — runs against Sauce Labs, BrowserStack, or Maestro Cloud when secrets are configured.

## Running the Maestro suite locally

```bash
# Android — uses adb's first listed device, sets sensible defaults,
# kills any stale Maestro processes from a previous run.
npm run maestro:android

# iOS — picks the first booted simulator, applies the longer XCTest
# startup timeout iOS needs.
npm run maestro:ios

# Run a single flow against either platform:
scripts/maestro.sh android tests/maestro/smoke/launch.yaml
scripts/maestro.sh ios     tests/maestro/auth/login.yaml
```

The wrapper handles three things `maestro test …` doesn't on its own:

1. Kills lingering Maestro daemon processes that get into bad states when a previous run was interrupted (every flow then instant-fails in 0s).
2. Sets `MAESTRO_DRIVER_STARTUP_TIMEOUT=300000` for iOS (XCTest agent install can take 60–90s on first run).
3. Auto-detects the device id so you don't have to copy a UDID around.

### Release builds (recommended for CI and benchmarking)

By default `npm run ios` / `npm run android` builds in **debug** mode, which means each `clearState: true` cold-launch fetches the JS bundle from Metro (15–30s of latency per flow). For test runs that don't need hot reload, build a release variant once:

```bash
npm run android:release   # bundles JS into the APK
npm run ios:release       # bundles JS into the .app
```

Then run the suite against the installed release build. Cold starts drop from ~30s to ~1s and the suite runs ~3× faster.

## Tier 1: free PR checks

`.github/workflows/ci.yml` runs on every `pull_request` and `push` to `main`:

- `npm run typecheck`
- `npm run lint`
- `npm run format:check`

These are fast (≤ 1 minute) and catch the bulk of regressions.

## Tier 2: cloud labs (opt-in)

These workflows only execute when the corresponding repository secret exists, so a fork without credentials simply skips them.

### Maestro Cloud

`.github/workflows/maestro.yml` runs the entire `tests/maestro/` flow set on Maestro Cloud against an uploaded build. Trigger via:

- A tag push (`git tag v0.1.0 && git push --tags`)
- The **Run workflow** button in the Actions tab

Requires:

- `MAESTRO_CLOUD_API_KEY` — from https://app.mobile.dev
- One of `IOS_BUILD_URL` / `ANDROID_BUILD_URL` — a binary the cloud can install. You can build these in a parallel job (`expo build` / `expo run:android --variant release` then upload), or supply a fixed URL.

### Sauce Labs

`.github/workflows/sauce-labs.yml` runs the **smoke** Maestro flows against the Sauce Labs Real Device cloud via `saucectl`. The runner reads `.sauce/config.yml`, which mirrors the five-flow allowlist in `scripts/smoke.sh`. Manually triggered via the **Run workflow** button.

Requires:

- `SAUCE_USERNAME`
- `SAUCE_ACCESS_KEY`

### BrowserStack

`.github/workflows/browserstack.yml` uploads the release APK to App Storage and runs the **Appium** suite (`tests/appium/`) against a BrowserStack real device. Triggered nightly at 03:00 UTC and on demand.

Requires:

- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`

### Maestro Cloud — smoke

`.github/workflows/maestro-cloud-smoke.yml` runs the smoke flow allowlist on Maestro Cloud on every PR. Smaller and faster than the full nightly suite. Requires `MAESTRO_CLOUD_API_KEY`.

## Building binaries

For cloud lab runs you'll usually need a `.app` (iOS simulator) or `.apk` (Android). Locally:

```bash
# Debug build for simulator/emulator
npx expo run:ios --no-bundler
npx expo run:android --no-bundler --variant release
```

For release builds suitable for real devices, use [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
npx eas build --platform ios --profile preview
npx eas build --platform android --profile preview
```

EAS isn't required for CI; you can also build inside a workflow runner using Xcode / Gradle directly.

## Troubleshooting flaky runs

| Symptom                                           | Cause                                                | Fix                                                                                                                                  |
| ------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Every flow fails in `0s`                          | Stale Maestro daemon from a killed previous run      | `pkill -9 -f maestro` (the `scripts/maestro.sh` wrapper does this for you)                                                           |
| iOS flow times out at "iOS driver not ready"      | XCTest agent took longer than the default to install | `MAESTRO_DRIVER_STARTUP_TIMEOUT=300000` (the wrapper sets it)                                                                        |
| Cold-start `extendedWaitUntil` times out at 30s   | Debug build re-fetching the JS bundle from Metro     | Use a release build, or warm the app once before the suite                                                                           |
| Tap on a list item misses                         | Animation in progress                                | Animations are disabled in `config.yaml` — ensure your run is reading that workspace config (just point Maestro at `tests/maestro/`) |
| `Open in <App>?` system dialog blocks an iOS flow | Custom-scheme deep link confirmation                 | The conditional `tapOn 'Open'` in `scenario-deep-link.yaml` dismisses it; copy that pattern for new flows that use `openLink`        |
