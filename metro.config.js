const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('tflite', 'csv');

// whisper.rn -> safe-buffer does require('buffer'); RN has no Node builtin, and
// Expo shims it to a throw. Redirect to the userland `buffer` package instead.
const bufferPath = require.resolve('buffer/');
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'buffer') {
    return { type: 'sourceFile', filePath: bufferPath };
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
