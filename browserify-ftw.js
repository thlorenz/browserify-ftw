'use strict';
var fs             =  require('fs')
  , path           =  require('path')
  , map            =  require('map-stream')
  , readdirp       =  require('readdirp')
  , getResolvePath =  require('./lib/get-resolve-path')
  , upgrade        =  require('./lib/upgrade')
  , util           =  require('util')
  , options = {
        quote: '\''
      , style: 'var'
      , indent: 2
      , directoryFilter: null
      , fileFilter: '.js'
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
        if (err) return console.error(err);
        cb(null, { fullPath: entry.fullPath, src: res });
    });
  }

  function rewrite(file, cb) {
    console.log('rewriting', file.fullPath);

    var upgraded = upgrade(file.src, options, pathResolve(file.fullPath));
    console.log(upgraded);
    cb(null, upgraded);
  }
  
  readdirp({ root: requirejsDir, fileFilter: '*.js', directoryFilter: options.directoryFilter })
    .on('error', function (err) { 
      cb(new Error('When reading ' + requirejsDir + ':\n' + err.message));
    })
    .pipe(map(readFile))
    .pipe(map(rewrite))
    .on('data', function (data) {
      errors = errors.concat(data);
    })
    .on('end', function () { 
      cb(null, errors); 
    });
}

var fullPathToRequireJsConfig = path.join(__dirname, 'test/fixtures/requirejs-config.js');

upgradeProject(fullPathToRequireJsConfig, options, function (err, errors) {
  console.log('FINISHED', err);
});
