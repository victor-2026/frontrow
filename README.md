# FrontRow

> An open-source mobile app explicitly designed as a **QA automation training playground**.

FrontRow is a concert & events ticketing app for iOS and Android. It is intentionally built so that QA engineers can practice mobile test automation against a realistic-looking app that ships with stable accessibility identifiers, a debug menu, deterministic seed data, and hooks for every device-only capability that browsers can't reach.

It is the kind of app you would clone, run on a simulator in under five minutes, and then use to learn — or teach — Maestro, Appium, Espresso, and XCUITest.

## Status

Pre-alpha. Phase 0 (skeleton) is in progress. See [Roadmap](#roadmap).

## Why this exists

- The widely-used Sauce Labs `my-demo-app-rn` was deprecated in May 2024.
- Existing Maestro/Appium sample apps cover only login + cart.
- Nothing systematically exercises date control, location mocking, IAP simulation, purchase restoration, microphone, haptic feedback, biometric, push, deep links to arbitrary screens, and seedable scenarios all in one place.

FrontRow fills that gap, MIT-licensed, fork-friendly, no backend required.

## Quick start

Requires Node 20+ and either the Expo Go app on a device or an iOS simulator / Android emulator.

```bash
git clone <this repo>
cd frontrow
npm install
npm run ios       # or: npm run android
```

That's it. No backend to run, no accounts to create, no secrets to configure.

## What's inside

- **React Native + Expo (managed mode for now)** — single codebase, runs on Expo Go.
- **Local-first** — all data lives in `AsyncStorage`, seeded from JSON fixtures. Mock API via MSW.
- **Stable test IDs** — central registry in `src/testIds.ts`, lint rule enforces coverage.
- **QA Debug Menu** — long-press the logo or shake to open. Deep-link to any screen, seed scenarios, time-travel, mock location, fire fake push, simulate IAP outcomes, force errors.
- **Deep link contract** — every public deep link documented in `docs/DEEPLINKS.md`.
- **Hermetic mode** — `QA_MODE=1` disables animations, forces deterministic IDs, routes API to the mock layer, suppresses real push.

## Test frameworks

| Framework                 | Status  | Lives in          |
| ------------------------- | ------- | ----------------- |
| Maestro                   | Phase 1 | `tests/maestro/`  |
| Appium (WebdriverIO + TS) | Phase 6 | `tests/appium/`   |
| Espresso (Android)        | Phase 5 | `tests/espresso/` |
| XCUITest (iOS)            | Phase 5 | `tests/xcuitest/` |

## Roadmap

- **Phase 0** — Repo skeleton, toolchain, CI, navigation, placeholder screens.
- **Phase 1** — Mock API + persistence + core flows (auth, browse, buy ticket, my tickets) + first Maestro flows.
- **Phase 2** — QA Debug Menu, hermetic test mode, deep-link-to-anywhere.
- **Phase 3** — Device capabilities (camera, mic, location, biometric, haptic, calendar, share, background).
- **Phase 4** — Mock IAP (success, decline, cancel, restore, refund).
- **Phase 5** — Native showcase (Swift + Kotlin screens) + MMKV migration + Espresso + XCUITest.
- **Phase 6** — Appium suite + cloud lab CI (Sauce Labs / BrowserStack / Maestro Cloud).
- **Phase 7** — Tutorials, scenario recipes, README polish.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Issues, scenario ideas, and tutorials are all welcome.

## License

[MIT](LICENSE).
