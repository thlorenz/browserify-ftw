var vm = require('vm');

module.exports = function sourceConfig(code) {
  var config = {} 
    , sandbox = {
        requirejs: {
          config: function (conf) { config = conf; }
        }
        , require: function () { }
      }
    , context = vm.createContext(sandbox);

  vm.runInContext(code, context, 'requirejs-config.vm');

  return config;
};
