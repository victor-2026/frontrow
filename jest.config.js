// jest-expo handles the babel preset, RN module mocks, and the
// transformIgnorePatterns dance for ESM-shipped modules.

// Pin the timezone so date/time snapshots are deterministic regardless
// of where the suite runs — developer machines in CEST/EDT/etc. would
// otherwise diverge from CI's UTC runner. Set before module.exports so
// the value is in place before any Date-using code loads.
process.env.TZ = 'UTC';

module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  collectCoverageFrom: [
    'src/api/services/**/*.ts',
    'src/hooks/**/*.ts',
    'src/components/**/*.tsx',
    'src/screens/**/*.tsx',
    '!src/**/__tests__/**',
  ],
};
