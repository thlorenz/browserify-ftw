'use strict';
var style = require('./style');

module.exports = function exportify(code, returnStmt, options) {
  var uptoReturn = code.substring(0, returnStmt.start)
    , returnArgs = code.substring(returnStmt.argument.start, returnStmt.argument.end)
    , afterReturn = code.substring(returnStmt.end - 1);

  return uptoReturn + style.tabLeft('module.exports = ' + returnArgs, options.indent) + afterReturn;
};
