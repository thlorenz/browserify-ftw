#!/usr/bin/env node
'use strict';

var util    =  require('util')
  , fs      =  require('fs')
  , path    =  require('path')
  , log     =  require('npmlog')
  , xtend   =  require('xtend')
  , bftw    =  require('../browserify-ftw')
  , options
  , defaultOptionsPath = path.join(__dirname, '../lib/refactor-config.js')
  , defaultOptions= require(defaultOptionsPath)
  , argv = require('optimist')
      .options('r', {
          alias    :  'requirejs'
        , describe :  'path to requirejs-config.js file'
        , demand   :  true
      })
      .options('c', {
          alias    :  'config'
        , describe :  'path to config to be used for the refactoring\n(https://github.com/thlorenz/browserify-ftw#preparing-a-custom-refactor-config)'
        , default  :  defaultOptionsPath
      })
      .options('b', {
          alias    :  'build'
        , describe :  'path at which the generated browserify build script should be saved'
        , default  :  './build.js'
      }) 
      .options('u', {
          alias    :  'bundle'
        , describe :  'path at which the bundle generated by the browserify build should be saved'
        , default  :  './bundle.js'
      })
      .options('e', {
          alias    :  'entry'
        , describe :  'path at which the entry file for browserify will be located'
        , demand   :  true
      })
      .argv
  , fullRequireJs
  , fullConfig
  , fullBuildJs  
  , bundleJs
  , entryJs
  ;

function inspect(obj, depth) {
  console.log(util.inspect(obj, false, depth || 5, true));
}

function printUsage() {
  log.info('browserify-ftw', 'Usage:\n\t browserify-ftw /path/to/reqirejs-config.js [/path/to/refactor-config.js]');
}

var args = process.argv.slice(2);
if (!args.length) { 
  log.error('browserify-ftw', 'Missing path to requirejs config file');
  printUsage();
}

try {
  // fs.realpathSync will throw if requirejs-config or refactor-config don't exist
  fullRequireJs =  fs.realpathSync(argv.requirejs);
  fullConfig    =  fs.realpathSync(argv.config);

  // using path.resolve for these since they don't exist yet
  fullBuildJs   =  path.resolve(argv.build);
  entryJs       =  path.relative(path.dirname(fullBuildJs), path.resolve(argv.entry)); 
  bundleJs      =  path.relative(path.dirname(fullBuildJs), path.resolve(argv.bundle));

} catch (e) {
  log.error('browserify-ftw', 'While resolving given path(s):\n\t', e.message);
  process.exit(1);
}

try {
  options = xtend(defaultOptions, require(fullConfig));
} catch (e) {
  log.error('browserify-ftw', 'While reading refactor-config:\n\t', e.message);
  process.exit(1);
}

// pass entry.js and bundle target via command line
bftw(fullRequireJs, fullBuildJs, bundleJs, entryJs, options, function (err) {
  if (err) {
    log.error('browserify-ftw', err);
    return process.exit(1);
  }

  log.info('browserify-ftw', '\nSuccessfully upgraded your project.');
  log.info('browserify-ftw', 'Please run valiquire "npm install -g valiquire" to validate all require paths.');
  process.exit(0);
});
