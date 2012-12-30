var fs = require('fs')
  , path = require('path')
  , sourceConfig = require('./source-config');

module.exports = function getResolvePath (fullPathToRequirejsConfig) {
  // this will only be used as part of a script, so sync ops are ok
  var code      =  fs.readFileSync(fullPathToRequirejsConfig, 'utf-8')
    , config    =  sourceConfig(code)
    , configDir =  path.dirname(fullPathToRequirejsConfig)
    , paths     =  {}
    , shim      =  config.shim || {};

  Object.keys(config.paths).forEach(function (k) {
    // null paths or shimmed modules denote global modules
    paths[k] = config.paths[k] !== null && !shim[k] 
      ? path.join(configDir, config.paths[k]) 
      : null;
  });

  function getResolvePathFor(upgradeFileFullPath) {
    var upgradeFileDir = path.dirname(upgradeFileFullPath);

    return function resolvePath(key) {
      var fullPath = paths[key];

      // explicitly setting a path to null denotes we don't want to change it (i.e., for global modules)
      if (fullPath === null) return key;

      // assume all non listed paths to be local modules (i.e. 'local' resolves to './local')
      if (fullPath === undefined) fullPath = path.join(configDir, key);

      var relativePath = path.relative(upgradeFileDir, fullPath);
      if (relativePath.indexOf('.') !== 0) relativePath = './' + relativePath;
      return relativePath;
    };
  }

  // somewhat hacky to return config that way, but wanted to keep the code that reads and sources it here
  getResolvePathFor.requireJSConfig = config;

  return getResolvePathFor;
};
