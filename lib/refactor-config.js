module.exports = {
    quote           :  '\''         // '\'' or '"'
  , style           :  'var'        // 'var', 'comma', 'comma-first' (so far only var is supported)
  , indent          :  2            // the tab size used in your project
  , directoryFilter :  null         // not supported yet
  , fileFilter      :  '.js'        // the extension of the file to upgrade
  , dryrun          :  true         // true|false if true no changes will be written to upgraded files
};
