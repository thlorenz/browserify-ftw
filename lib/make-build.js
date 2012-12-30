/*
 * Generates code similar to the below:
 *
 *  -- no shims required
 *  var browserify = require('browserify');
 *  var fs = require('fs');
 *  
 *  var bundled = browserify({ debug: true })
 *    .addEntry('./js/entry.js')
 *    .bundle();
 *
 *  fs.writeFileSync(bundleFile, bundled, 'utf-8');
 *  
 *  -- shimming jquery
 *  var browserify = require('browserify');
 *  var shim = require('browserify-shim');
 *  var fs = require('fs');
 *
 *  var bundled = browserify({ debug: true })
 *    .use(shim({ alias: 'jquery', path: './js/vendor/jquery.js', exports: '$' }))
 *    .addEntry('./js/entry.js')
 *    .bundle()
 *    .shim();
 *
 *  fs.writeFileSync(bundleFile, bundled, 'utf-8');
 */

var util = require('util')
  , style = require('./style')
  , format = util.format;

/**
 * Generates browserify bundler code. 
 * @name generate
 * @function
 * @param config {Object} with {Array} of shims and style config values
 * @param bundleFile {String} relative path to the build file to which bundled content should be written
 * @param bundleFile {String} relative path to the file used by browserify as the entry 
 * @return {String} the generated code.
 */
module.exports = function generate(config, bundleFile, entryPath) {

  var quote = config.quote  
    , tab = style.spaces(config.indent)
    , shims = config.shims
    , hasShims = shims && shims.length;

  entryPath = entryPath || '/please/replace/with/path/to/entry.js';

  function quoted(s) {
    return format('%s%s%s',quote, s, quote);
  }

  function pathJoinedAndQuoted(s) {
    return format('path.join(__dirname, %s)', quoted(s));
  }
  
  function generateRequire(assign, name) {
    return format('var %s = require(%s);\n', assign, quoted(name));
  }

  function generateBundleHead() {
    return 'var bundled = browserify({ debug: true })\n';
  }

  function generateShim(shim) {
    var exp = shim.exports ? quoted(shim.exports) : 'null'; 
    return format('%s.use(shim({ alias: %s, path: %s, exports: %s }))\n', tab, quoted(shim.alias), quoted(shim.path), exp);
  }

  function generateAddEntry() {
    return format('%s.addEntry(%s)\n', tab, pathJoinedAndQuoted(entryPath));
  }

  function generateBundleFoot() {
    return hasShims
      ? format('%s.bundle()\n%s.shim();\n', tab, tab)
      : format('%s.bundle();\n', tab);
  }

  function generateWriteBundle() {
    return format('fs.writeFileSync(%s, %s, %s);\n', pathJoinedAndQuoted(bundleFile), 'bundled', quoted('utf-8'));
  }

  var requires = '';
  requires += generateRequire('fs', 'fs');
  requires += generateRequire('path', 'path');
  requires += generateRequire('browserify', 'browserify');
  requires += hasShims ? generateRequire('shim', 'browserify-shim') : '';

  var shimCode = hasShims 
    ? shims.map(generateShim).join('')
    : '';

  return  requires
        + '\n'
        + generateBundleHead()
        + shimCode
        + generateAddEntry()
        + generateBundleFoot()
        + '\n'
        + generateWriteBundle();
};
