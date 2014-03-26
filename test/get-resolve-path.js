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
      , underscore :  null
    } 

function inspect(obj, depth) {
  return util.inspect(obj, false, depth || 5, true);
}

test('\ngiven the require paths: \n' + inspect(requirePaths), function (t) {

  function runTest(ctx) {
    t.test('\n# given upgrade file is ' + ctx.file + ' relative to requirejs config', function (t) {
      var resolve = resolvePathFor(path.join(__dirname, 'fixtures/', ctx.fixture))
        , expected = {
            jquery     :  ctx.expected[0]
          , director   :  ctx.expected[1]
            // handlebars is shimmed, therefore it will be kept as global
          , handlebars :  'handlebars'
          , hbs        :  ctx.expected[2]
            // the below are not defined in paths and therefore are assumed to be relative to the requirejs config path
          , mymodule   :  ctx.expected[3]
          , 'lib/mylib':  ctx.expected[4]
            // the below are set to null in the path and therefore are assumed to be resolved as globael (i.e. a node_module)
          , underscore :  'underscore'
        }
      Object.keys(expected).forEach(function (k) {
        t.equals(resolve(k), expected[k], 'resolves ' + k + ' to: ' + expected[k]);
      });
      t.end()
    });
  }

  var tests = [{
      file: './file.js'
    , fixture: 'myfile.js'
    , expected: [
          './vendor/jquery-1.8.0'
        , './lib/director-1.1.3'
        , './lib/specific/hbs'
        , './mymodule'
        , './lib/mylib'
      ]
  },{
      file: './lib/file.js'
    , fixture: 'lib/myfile.js'
    , expected: [
          '../vendor/jquery-1.8.0'
        , './director-1.1.3'
        , './specific/hbs'
        , '../mymodule'
        , './mylib'
      ]
  },{
      file: './vendor/file.js'
    , fixture: 'vendor/myfile.js'
    , expected: [
          './jquery-1.8.0'
        , '../lib/director-1.1.3'
        , '../lib/specific/hbs'
        , '../mymodule'
        , '../lib/mylib'
      ]
  },{
      file: '../common/file.js'
    , fixture: '../common/myfile.js'
    , expected: [
          '../fixtures/vendor/jquery-1.8.0'
        , '../fixtures/lib/director-1.1.3'
        , '../fixtures/lib/specific/hbs'
        , '../fixtures/mymodule'
        , '../fixtures/lib/mylib'
      ]
  }];

  tests.forEach(runTest);

});
