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

The custom plugin [`eslint-plugin-frontrow`](../eslint-plugin-frontrow/) is wired into `eslint.config.js` and ships two rules:

- `frontrow/require-testid` — interactive components (`Button`, `Pressable`, `TouchableOpacity`, etc.) must declare a `testID`.
- `frontrow/require-a11y-label` — the same components must pair the `testID` with an `accessibilityLabel`.

Both run in `npm run lint`. The CI job fails on violations, so new code can't drift from the contract.

## Adding a new ID

1. Add the entry to [`src/testIds.ts`](../src/testIds.ts).
2. Reference it via `testIds.<area>.<element>` from the component.
3. Pair it with an `accessibilityLabel` describing the _purpose_ in human terms — the lint rule enforces this.
