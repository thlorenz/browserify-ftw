'use strict';

var fs             =  require('fs')
  , path           =  require('path')
  , map            =  require('map-stream')
  , readdirp       =  require('readdirp')
  , log            =  require('npmlog')
  , getResolvePath =  require('./lib/get-resolve-path')
  , upgrade        =  require('./lib/upgrade')
  ;

module.exports = function upgradeProject(fullPathToRequireJsConfig, options, cb) {
  var pathResolve = getResolvePath(fullPathToRequireJsConfig)
    , requireJSConfig = pathResolve.requireJSConfig
    , requirejsDir = path.dirname(fullPathToRequireJsConfig)
    , errors = [];

  function readFile(entry, cb) {
    fs.readFile(entry.fullPath, 'utf-8', function (err, res) {
        if (err) return log.error('browserify-ftw', err);
        cb(null, { fullPath: entry.fullPath, src: res });
    });
  }

  function writeFile(entry, cb) {
    // don't rewrite files that don't need to be upgraded
    if (!entry) return cb(null);

    fs.writeFile(entry.fullPath, entry.upgraded, 'utf-8', function (err, res) {
        if (err) return log.error('browserify-ftw', err);
        cb(null);
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

    return options.dryrun ? cb(null, null) : cb(null, { fullPath: file.fullPath, upgraded: upgraded });

  }

  function fileFilter(entry) {
    return entry.fullPath !== fullPathToRequireJsConfig && path.extname(entry.name) === options.fileFilter;
  }
  
  readdirp({ root: requirejsDir, fileFilter: fileFilter, directoryFilter: options.directoryFilter })
    .on('error', function (err) { 
      cb(new Error('When reading ' + requirejsDir + ':\n' + err.message));
    })
    .pipe(map(readFile))
    .pipe(map(rewrite))
    .pipe(map(writeFile))
    .on('end', cb);
};
