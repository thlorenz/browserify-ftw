'use strict';

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

/**
 * Normalizes shims and transforms them into an array and resolves all paths from the given paths.
 * @name prepareShims
 * @function
 * @param shims {Object} will be modified to include path to module if found
 * @param paths {Object} paths to all modules found in requireJS config
 * @return {Object} Of transformed shims and shim aliases for which no paths where found.
 */
module.exports = function prepareShims(shims_, paths) {

  if (!shims_) return { shims: [], missingPaths: [] };

  var missingPaths = []
    , shims = normalizeShims(shims_);

  shims.forEach(function (shim) {
    var p = paths[shim.alias];
    if (p) return shim.path = p; 

    missingPaths.push(shim.alias);
    shim.pathMissing = true;
    shim.path = '/please/replace/with/path/to/' + shim.alias + '.js';
  });  

  return { shims: shims, missingPaths: missingPaths };
};
