'use strict';
/*jshint asi: true */

var test      =  require('tap').test
  , fs        =  require('fs')
  , path = require('path')
  , cardinal  =  require('cardinal')
  , makeBuild =  require('../lib/make-build')
  , generated = path.join(__dirname, 'fixtures/generated') 

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

~function () {
  var config = {
      quote: '\''
    , indent: 2
  }
  , entryPath = './js/entry.js'

  var expected = fs.readFileSync(path.join(generated, 'without-shims.js'), 'utf-8')

  test('\nwhen generating browserify build when no modules need to be shimmed:\n' + inspect(config) + '\nGenerates:\n' + cardinal.highlight(expected),  function (t) {
    t.equals(makeBuild(config, './build/bundle.js', entryPath), expected)
    t.end();
  });
}();

~function () {
  var config = {
      quote: '"'
    , indent: 4
  }
  , entryPath = './js/entry.js'

  var expected = fs.readFileSync(path.join(generated, 'without-shims-tabsize-4-and-doublequotes.js'), 'utf-8')

  test('\nwhen generating browserify build when no modules need to be shimmed::\n' + inspect(config) + '\nGenerates:\n' + cardinal.highlight(expected),  function (t) {
    t.equals(makeBuild(config, './build/bundle.js', entryPath), expected)
    t.end();
  });
}();

~function () {
  var shims = [ 
      { alias: 'jquery', path: './js/vendor/jquery.js', export: '$' }
    , { alias: 'underscore', path: './js/vendor/underscore.js', export: null }
  ];

  var config = {
      quote: '\''
    , indent: 2
    , shims: shims
  }
  , entryPath = './js/entry.js'

  var expected = fs.readFileSync(path.join(generated, 'with-two-shims.js'), 'utf-8')

  test('\nwhen generating browserify build when two modules need to be shimmed:\n' + inspect(config) + '\nGenerates:\n' + cardinal.highlight(expected),  function (t) {
    t.equals(makeBuild(config, './build/bundle.js', entryPath), expected)
    t.end();
  });
}()
