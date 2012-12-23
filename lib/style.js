'use strict';

function spaces(indent) {
  for (var i = 1, s = ' '; i < indent; i++) s += ' ';
  return s;
}

function indentRegex(indent) {
  return new RegExp('^' + spaces(indent));
}

function fixLineIndent(line, regex) {
  return line.replace(regex, '');
}

function tabLeft(code, tabsize) {
  var regex = indentRegex(tabsize);
  return code
    .split('\n')
    .map(function (line) { return line.replace(regex, ''); })
    .join('\n');
}

module.exports = {
    tabLeft: tabLeft
  , spaces: spaces
};
