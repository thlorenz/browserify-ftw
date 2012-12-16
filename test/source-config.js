'use strict';
/*jshint asi: true */

var test = require('tap').test
  , fs = require('fs')
  , path = require('path')
  , sourceConfig = require('../lib/source-config')
  ;

test('sources config from given require js config code', function (t) {
  var expected = { 
    shim: { 
      handlebars: { exports: 'Handlebars' },
      underscore: { exports: '_' } 
    },
    paths: { 
      jquery: 'vendor/jquery-1.8.0',
      director: 'lib/director-1.1.3',
      handlebars: 'lib/handlebars.runtime' 
    } 
  }

  var js = fs.readFileSync(path.join(__dirname, 'fixtures/requirejs-config.js'), 'utf-8')
    , config = sourceConfig(js)

  t.deepEquals(config, expected, 'sources entire config')
  t.end()
})
