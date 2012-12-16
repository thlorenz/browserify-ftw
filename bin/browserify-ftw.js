#!/usr/bin/env node
'use strict';

var util    =  require('util')
  , path    =  require('path')
  , log     =  require('npmlog')
  , bftw    =  require('../browserify-ftw')
  , options =  {
        quote           :  '\''
      , style           :  'var'
      , indent          :  2
      , directoryFilter :  null
      , fileFilter      :  '.js'
      , dryrun          :  true
    }
  ;

function inspect(obj, depth) {
  console.log(util.inspect(obj, false, depth || 5, true));
}

var fullPathToRequireJsConfig = path.join(__dirname, '../test/fixtures/requirejs-config.js');

bftw(fullPathToRequireJsConfig, options, function (err) {
  if (err) return log.error('browserify-ftw', err);
  log.info('browserify-ftw', 'Successfully upgraded your project. Please run valiquire "npm install -g valiquire" to validate all require paths.');
});
