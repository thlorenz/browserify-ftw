'use strict';
var assert     =  require('assert')
  , util       =  require('util')
  , getWrapper =  require('./get-wrapper')
  , style      =  require('./style')
  , format     =  util.format
  ;

module.exports = function requirefy(code, options) {

  function removeRequirejs(code, head, tail) {
    var top = code.substring(0, head.start);
    var mid = code.substring(head.end, tail.start);
    var bot = code.substring(tail.end);

    return top + mid + bot;
  }

  function generateHead(wrapper) {
    var requires = [];

    assert(wrapper.paths.length === wrapper.params.length, 'number of paths should match number of parameters to callback');

    for (var i = 0; i < wrapper.paths.length; i++) 
      requires.push(format('%s = require(%s%s%s)', wrapper.params[i], options.quote, wrapper.paths[i], options.quote));

    var head;
    switch (options.style) {
      case 'var': head = requires.map(function (r) {
        return 'var ' + r + ';';  
      }).join('\n');
    }
    return head;
  }

  var wrapper = getWrapper(code)
    , head = generateHead(wrapper)
    , bare = removeRequirejs(code, wrapper.head, wrapper.tail)
    , regex = style.indentRegex(options.indent);

  var properlyIndented = bare
    .split('\n')
    .map(function (x) { return style.fixIndent(x, regex); } )
    .join('\n');

  return head + '\n' + properlyIndented;
};


