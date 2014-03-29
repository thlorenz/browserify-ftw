'use strict';
var util       =  require('util')
  , getWrapper =  require('./get-wrapper')
  , style      =  require('./style')
  , format     =  util.format
  , log        =  require('npmlog')
  ;

module.exports = function requirefy(code, options, resolvePath) {

  function getInnerHeader(code, headerStart, headerEnd) {
    var header = code.substr(headerStart, headerEnd - headerStart - 1);
    header = style.tabLeft(header, options.indent);
    // if header is only a bunch of spaces collapse to an empty string. 
    // if not, trim and add a newline.
    header = /^\s*$/.test(header) ? '' : header.trim() + '\n';
    return header;
  }

  function removeRequirejs(code, head, tail) {
    var top = code.substring(0, head.start - 1);
    var mid = code.substring(head.end, tail.start);
    var bot = code.substring(tail.end);

    return (top.length ? '\n' + top : '') 
      + style.tabLeft(mid, options.indent) 
      + bot;
  }

  function generateHead(wrapper) {
    var requires = [], i;

    if (wrapper.paths.length !== wrapper.params.length) {
      log.warn('browserify-ftw',
        'number of paths [' + wrapper.paths + '] does not match number of parameters to callback [' + wrapper.params + ']'
      );
    }

    for (i = 0; i < wrapper.paths.length; i++) {
      var name = wrapper.params[i]
        , resolvedPath = resolvePath(wrapper.paths[i]);

      if (name)
        requires.push({ named: true, string: format('%s = require(%s%s%s)', name, options.quote, resolvedPath, options.quote) });
      else 
        requires.push({ named: false, string: format('require(%s%s%s)',options.quote, resolvedPath, options.quote) });
    }

    var head;
    var noname = [], str, r;
    switch (options.style) {
      case 'var':
        head = requires.map(function (r) {
          return r.named ? 'var ' + r.string + ';' : r.string + ';';
        });
        break;
      case 'comma':
        head = [];

        for(i = 0; i < requires.length; i++ ) {
          r = requires[i];

          if(r.named) {
            head.push(i === 0 ? 'var ' + r.string + ',' : style.spaces(options.indent) + r.string + ',');
          } else {
            noname.push(r.string + ';');
          }
        }

        str = head[head.length-1];
        head[head.length - 1] = str.slice(0, str.length - 1) + ';';

        if(noname.length > 0) head = head.concat(noname);

        break;
      case 'comma-first':
        noname = [];
        head = [];

        for(i = 0; i < requires.length; i++ ) {
          r = requires[i];

          if(r.named) {
            head.push(i === 0 ? 'var ' + r.string : style.spaces(options.indent) + ', ' + r.string);
          } else {
            noname.push(r.string + ';');
          }
        }

        head[head.length-1] += ';';

        if(noname.length > 0) head = head.concat(noname);

        break;
    }
    return head.join('\n');
  }

  var wrapper = getWrapper(code)
    , head = generateHead(wrapper)
    , tail = removeRequirejs(code, wrapper.head, wrapper.tail);

  var innerHeader = getInnerHeader(code, wrapper.innerHeaderStart, wrapper.innerHeaderEnd);

  return innerHeader + head + '\n' + tail;
};
