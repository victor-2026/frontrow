// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const frontrowPlugin = require('./eslint-plugin-frontrow');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'node_modules/*',
      '.expo/*',
      'dist/*',
      'web-build/*',
      'ios/*',
      'android/*',
      'coverage/*',
    ],
  },
  {
    plugins: { frontrow: frontrowPlugin },
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'frontrow/require-testid': 'warn',
      'frontrow/require-a11y-label': 'warn',
    },
  },
]);
