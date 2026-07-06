module.exports = {
  testRunner: {
    $0: 'jest',
    args: {
      config: 'e2e/jest.config.js',
      _: ['e2e'],
    },
  },
  apps: {
    ios: {
      type: 'ios.app',
      binaryPath: 'ios/build/frontrow.app',
      build: 'xcodebuild -workspace ios/frontrow.xcworkspace -configuration Debug -scheme FrontRow -sdk iphonesimulator -derivedDataPath ios/build',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 16e',
      },
    },
  },
  configurations: {
    ios: {
      device: 'simulator',
      app: 'ios',
    },
  },
  behavior: {
    init: {
      exposeGlobals: true,
    },
  },
}
