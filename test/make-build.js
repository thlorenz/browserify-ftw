'use strict';
/*jshint asi: true */

var test      =  require('tap').test
  , fs        =  require('fs')
  , path      =  require('path')
  , highlight =  require('cardinal').highlight
  , makeBuild =  require('../lib/make-build')

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

function nl(label) {
  return '\n' + label + ':\n'
}

function runTest(ctx) {
  ~function () {
    var entryPath = './js/entry.js'
      , expected = fs.readFileSync(path.join(__dirname, 'fixtures/generated', ctx.fixture), 'utf-8');

    test(nl(ctx.label) + inspect(ctx.config) + nl('Generates') + highlight(expected),  function (t) {
      t.equals(makeBuild(ctx.config, './build/bundle.js', entryPath), expected)
      t.end();
    });
  }()
}

var tests = [{
  label: 'when generating browserify build when no modules need to be shimmed',
  config: {
    quote: '\''
  , indent: 2
  },
  fixture: 'without-shims.js'
},{
  label: 'when generating browserify build when no modules need to be shimmed',
  config: {
    quote: '"'
  , indent: 4
  },
  fixture: 'without-shims-tabsize-4-and-doublequotes.js'
},{
  label: 'when generating browserify build when two modules need to be shimmed',
  config: {
    quote: '\''
  , indent: 2
  , shims: [ 
      { alias: 'jquery', path: './js/vendor/jquery.js', exports: '$' }
    , { alias: 'underscore', path: './js/vendor/underscore.js', exports: null }
  ]
  },
  fixture: 'with-two-shims.js'
}];

tests.forEach(runTest);
