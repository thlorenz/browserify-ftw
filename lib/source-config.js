var vm = require('vm');

module.exports = function sourceConfig(code) {
  var config = {} 
    , requireConfig = function (config_) { config = config_; }
    , sandbox = {
          requirejs: {
            config: requireConfig
          }
        , require: function () { }
        , define: function () { }
      };

  sandbox.require.config = requireConfig;
  var context = vm.createContext(sandbox);

  vm.runInContext(code, context, 'requirejs-config.vm');

  return config;
};
