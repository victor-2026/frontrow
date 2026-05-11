# QA Debug Menu

The Debug tab is the central control surface for hermetic testing. Source: [`src/screens/DebugScreen.tsx`](../src/screens/DebugScreen.tsx).

## Opening the menu

- **Tab bar**: tap the **Debug** tab (visible in every build — see the README's "A note on the Debug tab" if you fork this app).
- **Deep link**: `frontrow://debug`.
- **Apply scenario via deep link**: `frontrow://debug/seed/<scenario_id>` — applied on app launch or while running.

## Sections (top to bottom)

### Build

Read-only info: app name, version + build number, platform + OS version, Expo SDK, env (development/production). Surfaces the values you need when triaging across builds.

### Jump to screen

One-tap navigation to every top-level screen. Useful when you want to verify a screen renders without driving a full flow.

### Device capabilities

One-tap entry to every device-feature demo: Haptics, Location, Biometric, Camera, Microphone, Calendar, Share, Notifications, and **Native demo** — the hand-rolled Swift `UIViewController` / Kotlin `AppCompatActivity` bridged through `NativeModules.FrontRowNativeDemo` (source in [`native-showcase/`](../native-showcase/)). The native demo is exposed under `debug.openNativeDemo` for Maestro.

### Scenarios

Tapping a scenario applies it immediately and invalidates all React Query caches so the UI re-renders against the new state. Catalog: [SCENARIOS.md](SCENARIOS.md). The currently-active scenario is marked with `✓`.

### Time travel

Sets `useQaStore.timeOffsetMs`. Anywhere the app needs "now," it goes through `now()` from `src/state/qa.ts` so this offset takes effect. Presets cover Now, +1h, +1d, +1w, +1mo.

### Network

- **Force error** — sets the next round of API calls to throw `ApiClientError` from `applyQaForcedError()`. Modes: `None`, `4xx` (400), `5xx` (500), `Timeout` (408), `Offline` (status 0). The `Offline` mode also surfaces a red banner across the top of the app via `app.offlineBanner` so tests can assert the offline UX without wiring NetInfo.
- **Profile** — pick a named latency profile (`fast`, `realistic`, `slow`, `flaky`). Every service function awaits `applyQaDelay()` for the profile's configured ms before resolving. The current effective delay is shown below the chips.

### Locale

Override the i18next/Intl locale for the session. Type a tag (e.g. `en`, `ja`, `de-DE`) and tap **Set**. Empty input restores device default.

### Notifications & crashes

- **Fire fake push** — shows an Alert simulating a push payload. Pairs with the `push` failure trigger to test delivery-failure UX.
- **Trigger crash** — throws asynchronously to exercise crash reporters (no Sentry/Crashlytics wired in this demo; see the README).

### First-run

- **Replay onboarding** — flips the persisted `onboardingPending` flag and re-renders the OnboardingScreen above the app. Lets QA exercise the swipe-through pager + skip path without uninstalling. The screen clears the flag itself when the user finishes or skips.

### Failure triggers

Eight toggles that arm deterministic failures (`push`, `geolocation`, `camera`, `biometric`, `imageUpload`, `sessionExpired`, `paymentTimeout`, `reviewSubmit`). Triggers compose. Catalog: [FAILURE_TRIGGERS.md](FAILURE_TRIGGERS.md). Toggle from a deep link with `frontrow://debug/trigger/<kind>[/on|/off]`.

### In-app purchases

- **Outcome** — flips the next mock purchase result (`success`, `decline`, `cancel`, `pending`).
- **Receipts** — shows the current count of mock receipts. **Reset receipts** wipes them.

Equivalent deep link: `frontrow://debug/iap/<outcome>`.

### Reset

**Wipe all local data** — resets the mock state, QA settings, auth session, billing receipts, and React Query cache.

### Analytics events

In-memory event log of `track(name, props)` calls (latest 200). Lets you write tests like _"tapping Buy fires `ticket.purchase.intent`"_. **Clear log** empties it without resetting anything else.
