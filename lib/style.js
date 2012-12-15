function indentRegex(indent, after) {
  after = after || '';
  for (var i = 0, spaces = ' '; i < indent; i++) spaces += ' ';
  return new RegExp('^' + spaces + after);
}

function fixIndent(line, regex) {
  return line.replace(regex, '');
}

module.exports = {
    indentRegex :  indentRegex
  , fixIndent   :  fixIndent
};
