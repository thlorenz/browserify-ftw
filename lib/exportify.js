'use strict';

module.exports = function exportify(code, returnStmt, codeStart) {
  var uptoReturn    =  code.substring(codeStart, returnStmt.start)
    , returnArg     =  code.substring(returnStmt.argument.start, returnStmt.argument.end)
    , afterReturn   =  code.substring(returnStmt.end - 1)
    , exports       =  'module.exports = ' + returnArg;

  return uptoReturn + exports + afterReturn;
};
