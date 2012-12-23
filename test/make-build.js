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

var config = {
    quote: '\''
  , indent: 2
  , entryPath: './js/entry.js'
};
var expected = fs.readFileSync(path.join(generated, 'without-shims.js'), 'utf-8')

test('\nwhen generating browserify build when no modules need to be shimmed:\n' + inspect(config) + '\nGenerates:\n' + cardinal.highlight(expected),  function (t) {
  t.equals(makeBuild(config, './build/bundle.js'), expected)
  t.end();
});

var shims = [ 
    { alias: 'jquery', path: './js/vendor/jquery.js', export: '$' }
  , { alias: 'underscore', path: './js/vendor/underscore.js', export: null }
];

config = {
    quote: '\''
  , indent: 2
  , entryPath: './js/entry.js'
  , shims: shims
};

expected = fs.readFileSync(path.join(generated, 'with-two-shims.js'), 'utf-8')

test('\nwhen generating browserify build when two modules need to be shimmed:\n' + inspect(config) + '\nGenerates:\n' + cardinal.highlight(expected),  function (t) {
  t.equals(makeBuild(config, './build/bundle.js'), expected)
  t.end();
});
