'use strict';
/*jshint asi: true */

var test = require('tap').test
  , fs = require('fs')
  , path = require('path')
  , sourceConfig = require('../lib/source-config')
  ;

test('\nsources config from given require js config code', function (t) {
  var expected = { 
    shim: { 
      handlebars: { exports: 'Handlebars' },
      underscore: { exports: '_' } 
    },
    paths: { 
        jquery     :  'vendor/jquery-1.8.0'
      , director   :  'lib/director-1.1.3'
      , handlebars :  'handlebars.runtime'
      , hbs        :  'lib/specific/hbs'
    } 
  }

  var js = fs.readFileSync(path.join(__dirname, 'fixtures/requirejs-config.js'), 'utf-8')
    , config = sourceConfig(js)

  t.deepEquals(config, expected, 'sources entire config')
  t.end()
})

test('\nsources config from given require js config code which uses require.config', function (t) {
  var expected = { 
    jQuery: '1.7.2',
    paths: {
        'jquery': 'modules/jquery'
    },
    map: {
        '*': {
            'jquery': 'modules/adapters/jquery'
        },
        'modules/adapters/jquery': {
            'jquery': 'jquery'
        }
    }
  }

  var js = fs.readFileSync(path.join(__dirname, 'fixtures/requirejs-config-using-require.js'), 'utf-8')
    , config = sourceConfig(js)

  t.deepEquals(config, expected, 'sources entire config')
  t.end()
})
