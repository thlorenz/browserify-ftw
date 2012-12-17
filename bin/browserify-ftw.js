#!/usr/bin/env node
'use strict';

var util    =  require('util')
  , fs = require('fs')
  , path    =  require('path')
  , log     =  require('npmlog')
  , bftw    =  require('../browserify-ftw')
  , options;

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

var requirejsConfigPath = args[0]
  , refactorConfigPath = args[1] || path.join(__dirname, '../lib/refactor-config.js')
  , fullPathToRequireJsConfig
  , fullPathToRefactorConfig
  ;

try {
  fullPathToRequireJsConfig = fs.realpathSync(requirejsConfigPath);
  fullPathToRefactorConfig = fs.realpathSync(refactorConfigPath);
} catch (e) {
  log.error('browserify-ftw', 'While resolving given path(s):\n\t', e.message);
  process.exit(1);
}

try {
  options = require(fullPathToRefactorConfig);
  // Poor man's validation
  if (!options.quote || !options.style) throw new Error(fullPathToRefactorConfig + 'is not a valid refactor config');
} catch (e) {
  log.error('browserify-ftw', 'While reading refactor-config:\n\t', e.message);
  process.exit(1);
}

bftw(fullPathToRequireJsConfig, options, function (err) {
  if (err) {
    log.error('browserify-ftw', err);
    return process.exit(1);
  }

  log.info('browserify-ftw', '\nSuccessfully upgraded your project.');
  log.info('browserify-ftw', 'Please run valiquire "npm install -g valiquire" to validate all require paths.');
  process.exit(0);
});
