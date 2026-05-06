'use strict';

const requireTestid = require('./src/require-testid');
const requireA11yLabel = require('./src/require-a11y-label');

const plugin = {
  meta: {
    name: 'eslint-plugin-frontrow',
    version: require('./package.json').version,
  },
  rules: {
    'require-testid': requireTestid,
    'require-a11y-label': requireA11yLabel,
  },
};

plugin.configs = {
  /**
   * Recommended config — enables both rules at warn level. Use via:
   *   plugins: { frontrow: require('eslint-plugin-frontrow') },
   *   ...require('eslint-plugin-frontrow').configs.recommended,
   */
  recommended: {
    plugins: { frontrow: plugin },
    rules: {
      'frontrow/require-testid': 'warn',
      'frontrow/require-a11y-label': 'warn',
    },
  },
};

module.exports = plugin;
