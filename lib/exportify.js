'use strict';
var style = require('./style');

module.exports = function exportify(code, returnStmt) {
  var uptoReturn = code.substring(0, returnStmt.start)
    , returnArgs = code.substring(returnStmt.argument.start, returnStmt.argument.end)
    , afterReturn = code.substring(returnStmt.end);

  return uptoReturn + style.tabLeft('module.exports = ' + returnArgs) + afterReturn;
};
