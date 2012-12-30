'use strict';

var fs             =  require('fs')
  , path           =  require('path')
  , map            =  require('map-stream')
  , readdirp       =  require('readdirp')
  , log            =  require('npmlog')
  , cardinal       =  require('cardinal')
  , getResolvePath =  require('./lib/get-resolve-path')
  , prepareShims   =  require('./lib/prepare-shims')
  , makeBuild      =  require('./lib/make-build')
  , upgrade        =  require('./lib/upgrade')
  ;

module.exports = function upgradeProject(
      fullPathToRequireJsConfig
    , fullPathToBuildJs
    , relativePathToBundleJs
    , relativePathToEntryJs
    , options
    , cb) {

  var pathResolve     =  getResolvePath(fullPathToRequireJsConfig)
    , requireJSConfig =  pathResolve.requireJSConfig
    , requirejsDir    =  path.dirname(fullPathToRequireJsConfig)
    , buildjsDir      =  path.dirname(fullPathToBuildJs)
    , errors          =  [];

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
  
  function createBuildScript() {
    var prepared = prepareShims(requireJSConfig.shim, requireJSConfig.paths, requirejsDir, buildjsDir);
    options.shims = prepared.shims;

    var buildjs = makeBuild(options, relativePathToBundleJs, relativePathToEntryJs);
    log.info('browserify-ftw', '\nBuild script content:\n\n%s', cardinal.highlight(buildjs));
    log.info('browserify-ftw', 'Writing build script to %s\n', fullPathToBuildJs);

    if (options.shims && options.shims.length) {
      log.warn('browserify-ftw', 'Your build contains shims. Make sure to install browserify-shim to your project:');
      log.warn('browserify-ftw', 'npm -S install browserify-shim');
    }

    if (options.dryrun) return;

    fs.writeFileSync(fullPathToBuildJs, buildjs, 'utf-8');

  }

  readdirp({ root: requirejsDir, fileFilter: fileFilter, directoryFilter: options.directoryFilter })
    .on('error', function (err) { 
      cb(new Error('When reading ' + requirejsDir + ':\n' + err.message));
    })
    .pipe(map(readFile))
    .pipe(map(rewrite))
    .pipe(map(writeFile))
    .on('end', function () {
      createBuildScript();
      cb();
    });
};
