var director = require('director');

function someFunctionDefinedBeforeWrapper() {
  console.log('hello world');
}
 
var currentNav = null
  , navs = {
        github        :  github.init
      , blog          :  blog.init
      , about         :  about.init
    }
  ;

module.exports = navs;
