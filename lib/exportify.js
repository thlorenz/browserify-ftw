'use strict';

module.exports = function exportify(code, returnStmt) {
  var uptoReturn    =  code.substring(0, returnStmt.start)
    , returnArg     =  code.substring(returnStmt.argument.start, returnStmt.argument.end)
    , afterReturn   =  code.substring(returnStmt.end - 1)
    , exports       =  'module.exports = ' + returnArg;

  return uptoReturn + exports + afterReturn;
};
