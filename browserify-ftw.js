'use strict';

var esprima = require('esprima')
  , util = require('util')
  , syntax = esprima.Syntax
  , parse  = esprima.parse
  , esprimaOpts = {
        range: true
      , raw: true
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

var wrapper = getWrapper(ast);
inspect(wrapper);


