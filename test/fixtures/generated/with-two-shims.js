var fs = require('fs');
var path = require('path');
var browserify = require('browserify');
var shim = require('browserify-shim');

var bundled = browserify({ debug: true })
  .use(shim({ alias: 'jquery', path: './js/vendor/jquery.js', exports: '$' }))
  .use(shim({ alias: 'underscore', path: './js/vendor/underscore.js', exports: null }))
  .addEntry(path.join(__dirname, './js/entry.js'))
  .bundle()
  .shim();

fs.writeFileSync(path.join(__dirname, './build/bundle.js'), bundled, 'utf-8');
