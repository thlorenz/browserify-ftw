'use strict';

var getWrapper = require('./lib/get-wrapper')
  , requirefy = require('./lib/requirefy')
  , exportify = require('./lib/exportify')
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

var code = fs.readFileSync('./test/fixtures/define-multiline.js', 'utf-8');

/*
 * Need to parse AST twice, since ranges go out of sync everytime we modify the code
 * 1. Parse code, find return statement inside requirejs wrapper and replace with assignment to module.exports
 *    This needs to happen before removing the wrapper since requirejs considers returns on script level to be illegal.
 * 2. Parse resulting code, find and replace requirejs wrapper with appropriate requirejs statements
 */

var wrapper;

wrapper = getWrapper(code, true);
var exportified = exportify(code, wrapper.return, options);

wrapper = getWrapper(exportified, false);
var requirefied = requirefy(exportified, options);

console.log(requirefied);
