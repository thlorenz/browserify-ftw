var browserify = require('browserify');
var shim = require('browserify-shim');
var fs = require('fs');

var bundled = browserify({ debug: true })
  .use(shim({ alias: 'jquery', path: './js/vendor/jquery.js', export: '$' }))
  .use(shim({ alias: 'underscore', path: './js/vendor/underscore.js', export: null }))
  .use(shim.addEntry('./js/entry.js'))
  .bundle();

fs.writeFileSync('./build/bundle.js', bundled, 'utf-8');
