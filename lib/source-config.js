var vm = require('vm');

module.exports = function sourceConfig(code) {
  var config = {} 
    , sandbox = {
        requirejs: {
          config: function (config_) { config = config_; }
        }
        , require: function () { }
        , define: function () { }
      }
    , context = vm.createContext(sandbox);

  vm.runInContext(code, context, 'requirejs-config.vm');

  return config;
};
