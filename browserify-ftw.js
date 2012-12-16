'use strict';
var fs             =  require('fs')
  , path           =  require('path')
  , map            =  require('map-stream')
  , readdirp       =  require('readdirp')
  , log            =  require('npmlog')
  , getResolvePath =  require('./lib/get-resolve-path')
  , upgrade        =  require('./lib/upgrade')
  , util           =  require('util')
  , options = {
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


function upgradeProject(fullPathToRequireJsConfig, options, cb) {
  var pathResolve = getResolvePath(fullPathToRequireJsConfig)
    , requirejsDir = path.dirname(fullPathToRequireJsConfig)
    , errors = [];

  function readFile(entry, cb) {
    fs.readFile(entry.fullPath, 'utf-8', function (err, res) {
        if (err) return log.error('browserify-ftw', err);
        cb(null, { fullPath: entry.fullPath, src: res });
    });
  }

  function rewrite(file, cb) {
    log.info('browserify-ftw', '\nProcessing: ', file.fullPath);

    var upgraded = upgrade(file.src, options, pathResolve(file.fullPath));
    if (!upgraded) { 
      log.info('browserify-ftw', 'No requirejs wrapper found. Not upgrading.');
      return cb(null, null);
    }

    log.info('browserify-ftw', 'Found requirejs wrapper. Upgrading.');

    cb(null);
  }
  
  readdirp({ root: requirejsDir, fileFilter: '*.js', directoryFilter: options.directoryFilter })
    .on('error', function (err) { 
      cb(new Error('When reading ' + requirejsDir + ':\n' + err.message));
    })
    .pipe(map(readFile))
    .pipe(map(rewrite))
    .on('end', function () { 
      cb(null, errors); 
    });
}

var fullPathToRequireJsConfig = path.join(__dirname, 'test/fixtures/requirejs-config.js');

upgradeProject(fullPathToRequireJsConfig, options, function (err) {
  if (err) return log.error('browserify-ftw', err);
  log.info('browserify-ftw', 'Successfully upgraded your project. Please run valiquire "npm install -g valiquire" to validate all require paths.');
});
