// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

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
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
