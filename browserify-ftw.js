'use strict';
var fs             =  require('fs')
  , path           =  require('path')
  , getResolvePath =  require('./lib/get-resolve-path')
  , upgrade        =  require('./lib/upgrade');

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

var fullPathToRequireJsConfig = path.join(__dirname, 'test/fixtures/requirejs-config.js');
var pathResolve = getResolvePath(fullPathToRequireJsConfig);

var fullPathToFile = path.join(__dirname, 'test/fixtures/define-multiline.js');
var code = fs.readFileSync(fullPathToFile, 'utf-8');

var upgraded = upgrade(code, options, pathResolve(fullPathToFile));
console.log(upgraded);
