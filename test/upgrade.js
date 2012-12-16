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

function run(t, fixture) {
  var file = path.join(fixtures, fixture)
    , src = fs.readFileSync(file + '.js', 'utf-8')
    , tgt = fs.readFileSync(file + '.upgraded.js', 'utf-8').trim('\n')
    , upgraded = upgrade(src, defOpts, resolvePath).trim('\n');

  t.equals(cardinal.highlight(upgraded), cardinal.highlight(tgt), 'upgrades ' + fixture + '\n')
  t.end()
}

[ [ 'upgrades code with define wrapper with multiple dependencies'        , 'define-multiline' ]
, [ 'upgrades code with define wrapper function definition before wrapper', 'define-function-before' ]
, [ 'upgrades code with define wrapper function definition after wrapper' , 'define-function-after' ]
, [ 'upgrades code with define wrapper that returns a multiline object'   , 'define-return-multiline-object' ]
].forEach(function (testcase) {
    test('\n' + testcase[0], function (t) {
      run(t, testcase[1]) 
    })
})
