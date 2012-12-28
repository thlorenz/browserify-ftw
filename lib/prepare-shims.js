'use strict';
var path = require('path');

/**
 * Converts shims of format: ['dep'] into { deps: ['deps'] } and transform shim hash into an {Array} of shims.
 */
function normalizeShims(shims) {
  return Object.keys(shims).map(function (k) {
    var shim = shims[k];
    if (Array.isArray(shim)) shim = { deps: shim };
    shim.alias = k;
    return shim;
  });
}

function pathMissingFor(alias) {
  return '/please/replace/with/path/to/' + alias + '.js';
}

/**
 * Normalizes shims and transforms them into an array and resolves all paths from the given paths.
 * @name prepareShims
 * @function
 * @param shims {Object} will be modified to include path to module if found
 * @param paths {Object} paths to all modules found in requireJS config
 * @return {Object} Of transformed shims and shim aliases for which no paths where found.
 */
module.exports = function prepareShims(shims_, paths, requireJSDir, buildJSDir) {

  if (!shims_) return { shims: [], missingPaths: [] };

  var missingPaths = []
    , shims = normalizeShims(shims_)
    , prefix = path.relative(buildJSDir, requireJSDir);

  shims.forEach(function (shim) {
    var p = paths[shim.alias];
    if (p) return shim.path = (prefix ? prefix + (path.sep || '/') : '') + p; 

    missingPaths.push(shim.alias);
    shim.pathMissing = true;
    shim.path = pathMissingFor(shim.alias);
  });  

  return { shims: shims, missingPaths: missingPaths };
};

module.exports.pathMissingFor = pathMissingFor;
