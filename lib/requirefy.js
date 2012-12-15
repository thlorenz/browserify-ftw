'use strict';
var assert     =  require('assert')
  , util       =  require('util')
  , getWrapper =  require('./get-wrapper')
  , style      =  require('./style')
  , format     =  util.format
  ;

// TODO: adjust require paths
module.exports = function requirefy(code, options, resolvePath) {

  function removeRequirejs(code, head, tail) {
    var top = code.substring(0, head.start - 1);
    var mid = code.substring(head.end, tail.start);
    var bot = code.substring(tail.end);

    return (top.length ? '\n' + top : '') 
      + style.tabLeft(mid, options.indent) 
      + bot;
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
    , tail = removeRequirejs(code, wrapper.head, wrapper.tail);

  return head + '\n' + tail;
};


