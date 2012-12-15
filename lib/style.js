function indentRegex(indent) {
  for (var i = 1, spaces = ' '; i < indent; i++) spaces += ' ';
  return new RegExp('^' + spaces);
}

function fixIndent(line, regex) {
  return line.replace(regex, '');
}

module.exports = {
    indentRegex :  indentRegex
  , fixIndent   :  fixIndent
};
