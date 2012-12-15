'use strict';

var esprima = require('esprima')
  , assert = require('assert')
  , util = require('util')
  , syntax = esprima.Syntax
  , parse  = esprima.parse
  , format = util.format
  , esprimaOpts = {
        range: true
      , raw: true
    }
  , options = {
      quote: '\'',
      style: 'var'
    }
  ;

var reqjs = 
"define([ 'director' ], function (director) { return 1; })";


var ast = parse(reqjs, esprimaOpts);

function inspect(obj, depth) {
  console.log(util.inspect(obj, false, depth || 5, true));
}

function getWrapper(ast) {
  var wrappers = ast.body
    .map(function (node) {
      if (node.type !== syntax.ExpressionStatement) return null;

      var expression = node.expression;
      if (!expression) return null;
      if (expression.type !== syntax.CallExpression) return null;

      var name = expression.callee.name;
      if (name !== 'define' && name !== 'require') return null;

      var args = expression.arguments;
      if (!args.length) return null;

      // we found a requirejs wrapper
      var paths, fn;
      if (args[0].type === syntax.FunctionExpression) {
        // define(callback)
        paths = [];
        fn = args[0];
      } else {
        // define([..], callback)
        paths = args[0].elements.map(function (x) { return x.value; });
        fn = args[1];
      }

      // Examine callback function
      var params = fn.params.map(function (x) { return x.name; });

      return { 
          name: name
        , paths: paths
        , params: params
        , body: fn.body.body
        , head: { start: expression.range[0], end: fn.body.range[0] }
        , tail: { start: fn.body.range[1],    end: expression.range[1] }
      };
    })
    .filter(function (x) { return x; });
  return wrappers.length ? wrappers[0] : null;
}

function generateHead(wrapper) {
  var requires = [];

  assert(wrapper.paths.length === wrapper.params.length, 'number of paths should match number of parameters to callback');

  for (var i = 0; i < wrapper.paths.length; i++) 
    requires.push(format('%s = require(%s%s%s)', wrapper.params[i], options.quote, wrapper.paths[i], options.quote));

  var head;
  switch (options.style) {
    case 'var': head = requires.map(function (r) {
      return 'var ' + r + ';';  
    }).join('\n');
  }
  return head;
}

var wrapper = getWrapper(ast);
var head = generateHead(wrapper);
console.log(head);
//inspect(wrapper);



