var vm = require('vm');

/**
 * Sources requireJS config from given code.
 * @name sourceConfig
 * @function
 * @param code {String} The requireJS config source code.
 * @return {Object} The sourced requireJS config.
 */
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
