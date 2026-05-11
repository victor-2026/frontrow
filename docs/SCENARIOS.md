# Seed Scenarios

A scenario is a named set of seed data that puts the app into a specific state. Pick one from the **QA Debug Menu → Scenarios** or via deep link:

```
frontrow://debug/seed/<scenario_id>
```

All scenarios live together in [`src/mocks/seed/scenarios/registry.ts`](../src/mocks/seed/scenarios/registry.ts) — each is an entry in the `scenarios` object with an `apply()` that mutates `mockState` directly. The companion entry in [`src/testIds.ts`](../src/testIds.ts) (`debug.seedScenarioButton(id)`) generates the testID for the menu row.

## Available scenarios

| ID                | What it sets up                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `happy_path`      | Demo user with one upcoming ticket and three favorited events. Equivalent to a fresh `resetMockState()`.         |
| `empty_state`     | Logged-out user with no tickets anywhere. The home feed renders empty-state.                                     |
| `expired_tickets` | All of the user's tickets flipped to `status: used`. Useful for the Past-tickets filter and refund UI.           |
| `refund_pending`  | First ticket flipped to `status: refund_pending`. Pair with the cancel UI.                                       |
| `many_events`     | 25 events total (6 base + 19 extras), just over one page (pageSize=20). Minimum to exercise pagination + end-of-list marker without bloating run time. |
| `error_state`     | Resets state; pair with **Network → Force error → 5xx** in the debug menu to make the next API call fail.        |
| `slow_network`    | Resets state; pair with **Network → Profile → slow** to add per-call latency.                                    |
| `offline`         | Resets state; pair with **Network → Force error → Offline** to surface the offline banner and cached data only.  |

The last three scenarios are companions to debug-menu toggles rather than self-contained — they get the data into a known shape and you flip the network behavior alongside.

## Adding a scenario

1. Add an entry to the `scenarios` object in [`src/mocks/seed/scenarios/registry.ts`](../src/mocks/seed/scenarios/registry.ts) and the `ScenarioId` union above it.
2. Implement `apply()` — start with `resetMockState()`, then mutate `mockState.*` directly.
3. Document it here (one row in the table above).
4. No testID work needed — `debug.seedScenarioButton(<id>)` is a factory in [`src/testIds.ts`](../src/testIds.ts) and picks up new IDs automatically.
