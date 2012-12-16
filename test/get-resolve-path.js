'use strict';
/*jshint asi: true */

var test = require('tap').test
  , fs = require('fs')
  , path = require('path')
  , util = require('util')
  , getResolvePath = require('../lib/get-resolve-path')

var fullPathToRequirejsConfig = path.join(__dirname, 'fixtures/requirejs-config.js')
  , resolvePathFor = getResolvePath(fullPathToRequirejsConfig)
  , requirePaths = { 
        jquery     :  'vendor/jquery-1.8.0'
      , director   :  'lib/director-1.1.3'
      , handlebars :  'handlebars.runtime'
      , hbs        :  'lib/specific/hbs'
    } 

function inspect(obj, depth) {
  return util.inspect(obj, false, depth || 5, true);
}

function run(t, expected, resolve) {
  Object.keys(expected).forEach(function (k) {
    t.equals(resolve(k), expected[k], 'resolves ' + k + ' to: ' + expected[k]);
  });
  t.end()
}

test('\ngiven the require paths: \n' + inspect(requirePaths), function (t) {
  t.test('\n# given upgrade file is ./file.js relative to requirejs config', function (t) {
    var resolve = resolvePathFor(path.join(__dirname, 'fixtures/myfile.js'))
      , expected = {
          jquery     :  './vendor/jquery-1.8.0'
        , director   :  './lib/director-1.1.3'
        , handlebars :  './handlebars.runtime'
        , hbs        :  './lib/specific/hbs'
          // the below are not defined in paths and therefore are assumed to be relative to the requirejs config path
        , mymodule   :  './mymodule'
        , 'lib/mylib':  './lib/mylib'
      }
    run(t, expected, resolve)
  });
  
  t.test('\n# given upgrade file is ./lib/file.js relative to requirejs config', function (t) {
    var resolve = resolvePathFor(path.join(__dirname, 'fixtures/lib/myfile.js'))
      , expected = {
          jquery     :  '../vendor/jquery-1.8.0'
        , director   :  './director-1.1.3'
        , handlebars :  '../handlebars.runtime'
        , hbs        :  './specific/hbs'
          // the below are not defined in paths and therefore are assumed to be relative to the requirejs config path
        , mymodule   :  '../mymodule'
        , 'lib/mylib':  './mylib'
      }
    run(t, expected, resolve)
  });

  t.test('\n# given upgrade file is ./vendor/file.js relative to requirejs config', function (t) {
    var resolve = resolvePathFor(path.join(__dirname, 'fixtures/vendor/myfile.js'))
      , expected = {
          jquery     :  './jquery-1.8.0'
        , director   :  '../lib/director-1.1.3'
        , handlebars :  '../handlebars.runtime'
        , hbs        :  '../lib/specific/hbs'
          // the below are not defined in paths and therefore are assumed to be relative to the requirejs config path
        , mymodule   :  '../mymodule'
        , 'lib/mylib':  '../lib/mylib'
      }
    run(t, expected, resolve)
  });

  t.test('\n# given upgrade file is ../common/file.js relative to requirejs config', function (t) {
    var resolve = resolvePathFor(path.join(__dirname, 'common/myfile.js'))
      , expected = {
          jquery     :  '../fixtures/vendor/jquery-1.8.0'
        , director   :  '../fixtures/lib/director-1.1.3'
        , handlebars :  '../fixtures/handlebars.runtime'
        , hbs        :  '../fixtures/lib/specific/hbs'
          // the below are not defined in paths and therefore are assumed to be relative to the requirejs config path
        , mymodule   :  '../fixtures/mymodule'
        , 'lib/mylib':  '../fixtures/lib/mylib'
      }
    run(t, expected, resolve)
  });
});
