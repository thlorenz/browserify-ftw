'use strict';
/*jshint asi: true */

var test = require('tap').test
  , path = require('path')
  , fs = require('fs')
  , cardinal = require('cardinal')
  , upgrade = require('../lib/upgrade')
  , fixtures = path.join(__dirname, 'fixtures')
  , defOpts = {
      quote: '\''
    , style: 'var'
    , indent: 2
    }
  , commaOpts = {
      quote: '\''
    , style: 'comma'
    , indent: 2
    }
  , commaFirstOpts = {
      quote: '\''
    , style: 'comma-first'
    , indent: 2
  }

function resolvePath(p) {
  return './resolved/' + p;
}

function printDetails(src, tgt, upgraded) {
  console.log(
    cardinal.highlight(src) + '\n' +
    '==========\nexpected:\n' +
    cardinal.highlight(tgt) + '\n' +
    '==========\nactual:\n' +
    cardinal.highlight(upgraded)
  );
}

function run(t, fixture, opts) {
  var file = path.join(fixtures, fixture)
    , src = fs.readFileSync(file + '.js', 'utf-8')
    , tgt = fs.readFileSync(file + '.upgraded.js', 'utf-8').trim('\n')
    , upgraded = upgrade(src, opts || defOpts, resolvePath).trim('\n');

  t.equals(cardinal.highlight(upgraded), cardinal.highlight(tgt), 'upgrades ' + fixture + '\n')
  t.end()
}

[ 
, [ 'upgrades code with define wrapper with multiple dependencies'                         , 'define-multiline' ]
, [ 'upgrades code with define commonjs simplified wrapper with multiple dependencies'     , 'define-simplified-wrapper' ]
, [ 'upgrades code with define commonjs module-exports wrapper with multiple dependencies' , 'define-module-export-wrapper' ]
, [ 'upgrades code with define commonjs module-exports wrapper with no dependencies'       , 'define-no-requires']
, [ 'upgrades code with define wrapper with multiple dependencies using comma style'       , 'define-multiline-comma', commaOpts ]
, [ 'upgrades code with define wrapper with multiple dependencies using comma-first style' , 'define-multiline-comma-first', commaFirstOpts ]
, [ 'upgrades code with define wrapper function definition before wrapper'                 , 'define-function-before' ]
, [ 'upgrades code with define wrapper function definition after wrapper'                  , 'define-function-after' ]
, [ 'upgrades code with define wrapper that returns a multiline object'                    , 'define-return-multiline-object' ]
, [ 'upgrades code with require wrapper that has dependencies but no params'               , 'require-noparams' ]
].forEach(function (testcase) {
    test('\n' + testcase[0], function (t) {
      run(t, testcase[1], testcase[2])
    })
})

test('\nwhen a file has no requirejs wrapper and therefore cannot be upgraded', function (t) {
  var file = path.join(fixtures, 'commonjs' )
    , src = fs.readFileSync(file + '.js', 'utf-8')
    , upgraded = upgrade(src, defOpts, resolvePath)

  t.notOk(upgraded, 'returns null since it cannot be upgraded')
  t.end()
})

test('\nwhen a file contains code that is not parsable ', function (t) {
  var src = '// script level returns are not allowed\nreturn 1;'
    , upgraded = upgrade(src, defOpts, resolvePath)

  t.notOk(upgraded, 'returns null since it cannot be upgraded')
  t.end()
})

test('\nwhen upgrading code that has unassigned commonjs require statements', function (t) {
  var src = "require('./resolved/handlebars-templates');\n" +
            "require('./resolved/router');\n"
    , upgraded = upgrade(src, defOpts, resolvePath)

  t.notOk(upgraded, 'returns null since it cannot be upgraded')
  t.end()
});
