# QA Debug Menu

The debug menu is the central control surface for hermetic testing.

> Phase 0 ships a placeholder Debug tab. The full menu lands in Phase 2.

## Opening the menu

- **Tab bar**: tap the **Debug** tab.
- **Long-press** the FrontRow logo on any tab. _(Phase 2)_
- **Shake** the device. _(Phase 2)_
- **Deep link**: `frontrow://debug`.

## Planned actions

| Action                   | Phase | Notes                                         |
| ------------------------ | ----- | --------------------------------------------- |
| Deep-link to any screen  | 2     | List of every route, tap to jump              |
| Apply seed scenario      | 2     | Picker over `docs/SCENARIOS.md`               |
| Reset / wipe local data  | 2     | Clears AsyncStorage and reloads               |
| Time travel              | 2     | Set the app's notion of "now"                 |
| Locale & region override | 2     | Drives i18next + date formatting              |
| Feature flag toggles     | 2     |                                               |
| Force next API error     | 2     | 4xx / 5xx / timeout                           |
| Network throttle         | 2     | Offline / slow 3G                             |
| Mock GPS location        | 3     | Coordinate presets                            |
| Fire fake push           | 2     | Local notification with custom payload        |
| Simulate IAP outcome     | 4     | Success / decline / cancel / restore / refund |
| Crash button             | 2     | For crash-reporter testing                    |
| Build info               | 0     | Version, commit, platform, env, SDK           |
| Analytics event log      | 2     | View what was fired during the session        |
