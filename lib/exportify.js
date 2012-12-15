'use strict';

module.exports = function exportify(code, returnStmt) {
  var uptoReturn = code.substring(0, returnStmt.start - 1)
    , afterReturn = code.substring(returnStmt.argument.start);

  var bareTop = uptoReturn + 'module.exports = ' + afterReturn;
};
