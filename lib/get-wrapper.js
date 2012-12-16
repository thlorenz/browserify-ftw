'use strict';
var esprima = require('esprima')
  , syntax = esprima.Syntax
  , parse  = esprima.parse;

function getReturnStatement(body) {
  // only finds top level return statements (i.e. only one)
  // no conditional returns are (i.e. inside if/else block) are considered
  var returns = body
    .map(function (node) {
      if (node.type !== syntax.ReturnStatement) return null;
      
      var arg = node.argument;
      if (!arg) return null;

      return {
          argument: { type: arg.type, start: arg.range[0], end: arg.range[1] }
        , start: node.range[0]
        , end: node.range[1]
      };
    })
    .filter(function (x) { return x; });

  return returns.length ? returns[0] : null;
}

function getWrapper(ast, getReturn) {
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

      var params = fn.params.map(function (x) { return x.name; });

      var returnStmt;
      if (getReturn) {
        returnStmt = getReturnStatement(fn.body.body);
      }

      return { 
          name: name
        , paths: paths
        , params: params
        , return: returnStmt
        , body: fn.body.body
        , head: { start: expression.range[0],   end: fn.body.range[0] + 1 }
        , tail: { start: fn.body.range[1] - 1,  end: expression.range[1] + 1 }
      };
    })
    .filter(function (x) { return x; });
  return wrappers.length ? wrappers[0] : null;
}

module.exports = function (code, getReturn) {
  try {
    var ast = parse(code, { range: true });
    return getWrapper(ast, getReturn);
  } catch (e) {
    console.error(e);
    return null;
  }
};
