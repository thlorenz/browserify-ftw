// demonstrates the case of a file that can't be upgraded because it is not a requirejs file
var path = require('path');

function hello() {
  return 'hello';
}

module.exports = hello;
