# eslint-plugin-frontrow

Two lint rules that keep a React Native app QA-friendly:

- **`frontrow/require-testid`** — every `Pressable`, `Touchable*`, `Switch`,
  `Button`, and any custom `*Button` with an `onPress` must have a
  `testID`. End-to-end tests address them by ID, so a missing one is a
  silent gap in coverage.

- **`frontrow/require-a11y-label`** — every interactive component (same
  set as above, minus button-text-derived labels) must have an
  `accessibilityLabel` (or `accessible={false}` to opt out). Mirrors the
  `testID` rule for screen-reader and Maestro label-based locators.

## Install

```bash
npm install --save-dev eslint-plugin-frontrow
```

## Configure

### Flat config (ESLint 9+)

```js
// eslint.config.js
const frontrow = require('eslint-plugin-frontrow');

module.exports = [
  // ...your existing config
  {
    plugins: { frontrow },
    rules: {
      'frontrow/require-testid': 'warn',
      'frontrow/require-a11y-label': 'warn',
    },
  },
];
```

Or pull the recommended preset:

```js
const frontrow = require('eslint-plugin-frontrow');

module.exports = [
  // ...
  frontrow.configs.recommended,
];
```

## Why warn, not error

Both rules ship at `warn` because the gap is informational — you might
intentionally render an icon-only chevron without a label. Promote to
`error` in CI once the rule is satisfied across the codebase.

## License

MIT.
