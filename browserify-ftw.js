'use strict';

var upgrade = require('./lib/upgrade')
  , util = require('util')
  , options = {
        quote: '\''
      , style: 'var'
      , indent: 2
    }
  ;

function inspect(obj, depth) {
  console.log(util.inspect(obj, false, depth || 5, true));
}

var fs = require('fs');

var code = fs.readFileSync('./test/fixtures/define-return-multiline-object.js', 'utf-8');

var upgraded = upgrade(code, options, function (p) { return p; });

console.log(upgraded);
