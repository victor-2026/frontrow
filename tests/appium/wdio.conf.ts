import type { Options } from '@wdio/types'

export const config: Options.Testrunner = {
  runner: 'local',
  autoCompileOpts: {
    tsNodeOpts: {
      project: './tests/appium/tsconfig.json',
    },
  },

  specs: ['./specs/smoke.spec.ts'],
  exclude: [],

  maxInstances: 1,

  capabilities: [
    {
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 16e',
      'appium:platformVersion': '26.3',
      'appium:automationName': 'XCUITest',
      'appium:app': '/Users/victor/Library/Developer/Xcode/DerivedData/FrontRow-ezxyjzzilltjbogbnqogzybpwtkg/Build/Products/Debug-iphonesimulator/FrontRow.app',
      'appium:noReset': false,
      'appium:fullReset': false,
    },
  ],

  logLevel: 'info',
  outputDir: './output',

  port: 4723,
  services: [],

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  reporters: ['spec'],

  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
}
