import type { Options } from '@wdio/types';
import path from 'node:path';

import { sharedConfig } from './wdio.shared.conf';

const APP_PATH =
  process.env.IOS_APP_PATH ??
  path.resolve(__dirname, '../../ios/build/frontrow.app');

export const config: Options.Testrunner = {
  ...sharedConfig,
  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': process.env.IOS_DEVICE ?? 'iPhone 16e',
      'appium:udid': process.env.IOS_UDID ?? 'FD8F6288-6BC0-4761-B183-229813799045',
      'appium:platformVersion': process.env.IOS_VERSION ?? '26.3',
      'appium:app': APP_PATH,
      'appium:noReset': true,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 240,
      'appium:wdaDerivedDataPath': '/Users/victor/.appium/node_modules/appium-xcuitest-driver/build',
      'appium:usePrebuiltWDA': true,
    },
  ],
} as Options.Testrunner;
