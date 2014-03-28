'use strict';
var log = require('npmlog') 
  , esprima = require('esprima')
  , syntax = esprima.Syntax
  , parse  = esprima.parse
  , estraverse = require('estraverse');

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

function getCodeStart(ast) {
  var codeStart = 0;
  estraverse.traverse(ast.body[0], {
    enter: function (node, parent) {
      if (node.range) {
        codeStart = node.range[0];
        this.break();
      }
    }
  });
  return codeStart;
}

function getWrapper(ast, getReturn) {
  /* TODO: currently not handling:
   *  - define({ .. }) "Simple Name/Value Pairs" case (http://requirejs.org/docs/api.html#defsimple)
  */
  var codeStart = getCodeStart(ast);
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
      var paths, fn, params;
      if (args[0].type === syntax.FunctionExpression) {
        // define(callback)
        var declsWithRequire = expression.arguments[0].body.body.filter(function(decl){
          return decl.type === "VariableDeclaration"
                 && decl.declarations[0].init
                 && decl.declarations[0].init.callee
                 && decl.declarations[0].init.callee.name === 'require';
        }) || [];

        paths = declsWithRequire.map(function(decl){ 
          return decl.declarations[0].init.arguments[0].value;
        });

        params = declsWithRequire.map(function(decl){ 
          return decl.declarations[0].id.name;
        });

        var firstDeclWithRequire = declsWithRequire[0];
        var headStartWithRequire = (firstDeclWithRequire && firstDeclWithRequire.range) ?
          firstDeclWithRequire.range[0] + 1 :
          expression.range[0];

        var lastDeclWithRequire = declsWithRequire[declsWithRequire.length - 1];
        var headEndWithRequire = (lastDeclWithRequire && lastDeclWithRequire.range) ?
          lastDeclWithRequire.range[1] + 1 :
          expression.range[0];

        fn = args[0];
      } else {
        // define([..], callback)

        // require('./foo');  - commonjs require -> no upgrade needed
        if (!args[0] || !args[0].elements) return null;

        paths = args[0].elements.map(function (x) { return x.value; });
        fn = args[1];
        params = fn && fn.params ? fn.params.map(function (x) { return x.name; }) : [];
      }

      var fnInnerBody = fn && fn.body ? fn.body.body : null;

      var returnStmt;
      if (getReturn && fnInnerBody) {
        returnStmt = getReturnStatement(fnInnerBody);
      }

      var headEnd, tailStart, innerHeaderStart, innerHeaderEnd;

      if (fn && fn.body) {
        headEnd = fn.body.range[0] + 1;
        tailStart = fn.body.range[1] - 1;
        innerHeaderStart = headEnd;
        innerHeaderEnd = headStartWithRequire;
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
        , codeStart: codeStart
        , innerHeaderStart: innerHeaderStart
        , innerHeaderEnd: innerHeaderEnd
        , return: returnStmt
        , body: fnInnerBody
        , head: { start: expression.range[0], end: headEndWithRequire ? headEndWithRequire : headEnd }
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
