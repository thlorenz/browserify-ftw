'use strict';
/*jshint asi: true */

var test = require('tap').test
  , fs = require('fs')
  , path = require('path')
  , sourceConfig = require('../lib/source-config')
  ;

function runTest(ctx) {
  test('\n' + ctx.label, function (t) {
    var js = fs.readFileSync(path.join(__dirname, 'fixtures', ctx.fixture), 'utf-8')
      , config = sourceConfig(js)

    t.deepEquals(config, ctx.expected, 'sources entire config')
    t.end()
  })
}

var tests = [{
  label: 'sources config from given require js config code',
  fixture: 'requirejs-config.js',
  expected: { 
    shim: { 
      handlebars: { exports: 'Handlebars' },
      underscore: { exports: '_' } 
    },
    paths: { 
        jquery     :  'vendor/jquery-1.8.0'
      , director   :  'lib/director-1.1.3'
      , handlebars :  'handlebars.runtime'
      , hbs        :  'lib/specific/hbs'
      , underscore :  null
    } 
  }
},{
  label: 'sources config from given require js config code which uses require.config',
  fixture: 'requirejs-config-using-require.js',
  expected: { 
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
}];

tests.forEach(runTest);
