const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === '../../src/private/devsupport/rndevtools/ReactDevToolsSettingsManager' &&
    context.originModulePath.includes('setUpReactDevTools.js')
  ) {
    const base = path.join(__dirname, 'node_modules/react-native/src/private/devsupport/rndevtools');
    const file = platform === 'ios'
      ? 'ReactDevToolsSettingsManager.ios.js'
      : 'ReactDevToolsSettingsManager.android.js';
    return { filePath: path.join(base, file), type: 'sourceFile' };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
