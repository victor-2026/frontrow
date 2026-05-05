# Test ID Conventions

Every interactive element in FrontRow has a `testID` (Maestro / Appium / Espresso / XCUITest hook) and an `accessibilityLabel` (real users with screen readers).

## Where they live

`src/testIds.ts` is the single source of truth. Never hard-code an ID at a call site — always reference it through the registry.

## Naming

`<screen-or-area>.<element>[.<id>]`

Examples:

- `screen.events`
- `eventDetail.buyButton`
- `events.item.evt_42` (parameterized via factory function)
- `debug.seedScenario.expired_tickets`

## Per-platform behaviour

- **iOS (XCUITest, Appium iOS)** — `testID` becomes `accessibilityIdentifier`.
- **Android (Espresso, Appium Android)** — `testID` becomes the view's `resource-id`.
- **Maestro** — uses `id:` matchers against either platform.

## Lint enforcement

A custom ESLint rule (planned for Phase 0/1) flags interactive components missing a `testID`. Until it lands, add IDs by hand and use the PR template checklist.

## Adding a new ID

1. Add the entry to `src/testIds.ts`.
2. Reference it via `testIds.<area>.<element>` from the component.
3. Pair it with an `accessibilityLabel` describing the _purpose_ in human terms.
