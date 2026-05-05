# Seed Scenarios

A scenario is a named set of seed data that puts the app into a specific state. Pick one from the **QA Debug Menu** or via deep link:

`frontrow://debug/seed/<scenario_id>`

> Scenarios land in Phase 1 (the data layer) and are wired to the debug menu in Phase 2.

## Planned scenarios

| ID                | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| `happy_path`      | A user with one upcoming ticket, three favorited events, no notifications. |
| `empty_state`     | A logged-out user with no data.                                            |
| `expired_tickets` | A user whose only tickets are in the past.                                 |
| `refund_pending`  | A user with a ticket whose refund is processing.                           |
| `many_events`     | 200+ events, useful for list-perf testing.                                 |
| `error_state`     | API mocked to return 5xx for the next request.                             |
| `slow_network`    | API mocked to delay 3 seconds per call.                                    |
| `offline`         | Network disabled; cached data only.                                        |

Each scenario lives at `src/mocks/seed/scenarios/<id>.ts` and exports a function that hydrates the mock state.

## Adding a scenario

1. Create `src/mocks/seed/scenarios/<id>.ts`.
2. Register it in `src/mocks/seed/registry.ts`.
3. Document it here (single row in the table).
4. Add the test ID `debug.seedScenarioButton(<id>)` (already a factory in `src/testIds.ts`).
