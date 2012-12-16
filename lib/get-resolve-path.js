var fs = require('fs')
  , path = require('path')
  , sourceConfig = require('./source-config');

module.exports = function getResolvePath (fullPathToRequirejsConfig) {
  // this will only be used as part of a script, so sync ops are ok
  var code      =  fs.readFileSync(fullPathToRequirejsConfig, 'utf-8')
    , config    =  sourceConfig(code)
    , configDir =  path.dirname(fullPathToRequirejsConfig)
    , paths     =  {};

  Object.keys(config.paths).forEach(function (k) {
    paths[k] = path.join(configDir, config.paths[k]);  
  });

  return function getResolvePathFor(upgradeFileFullPath) {
    var upgradeFileDir = path.dirname(upgradeFileFullPath);

    return function resolvePath(key) {
      var fullPath = paths[key];
      if (!fullPath) return key;

      var relativePath = path.relative(upgradeFileDir, fullPath);
      if (relativePath.indexOf('.') !== 0) relativePath = './' + relativePath;
      return relativePath;
    };
  };
};


