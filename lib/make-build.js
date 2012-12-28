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
 *    .use(shim({ alias: 'jquery', path: './js/vendor/jquery.js', export: '$' }))
 *    .use(shim.addEntry('./js/entry.js'))
 *    .bundle();
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
  
  function generateRequire(assign, name) {
    return format('var %s = require(%s);\n', assign, quoted(name));
  }

  function generateBundleHead() {
    return 'var bundled = browserify({ debug: true })\n';
  }

  function generateShim(shim) {
    var exp = shim.export ? quoted(shim.export) : 'null'; 
    return format('%s.use(shim({ alias: %s, path: %s, export: %s }))\n', tab, quoted(shim.alias), quoted(shim.path), exp);
  }

  function generateShimAddEntry() {
    return format('%s.use(shim.addEntry(%s))\n', tab, quoted(entryPath));
  }

  function generateAddEntry() {
    return format('%s.addEntry(%s)\n', tab, quoted(entryPath));
  }

  function generateBundle() {
    return format('%s.bundle();\n', tab);
  }

  function generateWriteBundle() {
    return format('fs.writeFileSync(%s, %s, %s);\n', quoted(bundleFile), 'bundled', quoted('utf-8'));
  }

  var requires = '';
  requires += generateRequire('browserify', 'browserify');
  requires += hasShims ? generateRequire('shim', 'browserify-shim') : '';
  requires += generateRequire('fs', 'fs');

  var shimCode = hasShims 
    ? shims.map(generateShim).join('')
    : '';

  var addEntry = hasShims
    ? generateShimAddEntry()
    : generateAddEntry();

  return  requires
        + '\n'
        + generateBundleHead()
        + shimCode
        + addEntry
        + generateBundle()
        + '\n'
        + generateWriteBundle();
};
