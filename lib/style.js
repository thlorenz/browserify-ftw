'use strict';

function indentRegex(indent) {
  for (var i = 1, spaces = ' '; i < indent; i++) spaces += ' ';
  return new RegExp('^' + spaces);
}

function fixLineIndent(line, regex) {
  return line.replace(regex, '');
}

module.exports.tabLeft = function tabLeft(code, tabsize) {
  var regex = indentRegex(tabsize);
  return code
    .split('\n')
    .map(function (line) { return line.replace(regex, ''); })
    .join('\n');
};
