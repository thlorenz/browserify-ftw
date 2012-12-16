'use strict';
var log = require('npmlog') 
  , esprima = require('esprima')
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

      var params = fn && fn.params ? fn.params.map(function (x) { return x.name; }) : [];
      var fnInnerBody = fn && fn.body ? fn.body.body : null;

      var returnStmt;
      if (getReturn && fnInnerBody) {
        returnStmt = getReturnStatement(fnInnerBody);
      }

      var headEnd, tailStart;

      if (fn && fn.body) {
        headEnd = fn.body.range[0] + 1;
        tailStart = fn.body.range[1] - 1;
      } else {
        /* E.g.:
         * require([ 'handlebars-templates', 'router' ]);
         */
        headEnd = expression.range[1] + 1;
        tailStart = expression.range[1] + 2;
      }

      return { 
          name: name
        , paths: paths
        , params: params
        , return: returnStmt
        , body: fnInnerBody
        , head: { start: expression.range[0], end: headEnd }
        , tail: { start: tailStart, end: expression.range[1] + 1 }
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
    log.error('get-wrapper', 'error while extracting wrapper', e);
    console.trace();
    return null;
  }
};
