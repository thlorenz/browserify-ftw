var browserify = require('browserify');
var shim = require('browserify-shim');
var fs = require('fs');

var bundled = browserify({ debug: true })
  .use(shim({ alias: 'jquery', path: './js/vendor/jquery.js', export: '$' }))
  .use(shim({ alias: 'underscore', path: './js/vendor/underscore.js', export: null }))
  .addEntry('./js/entry.js')
  .bundle()
  .shim();

fs.writeFileSync('./build/bundle.js', bundled, 'utf-8');
