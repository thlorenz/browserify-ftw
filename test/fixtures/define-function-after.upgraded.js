var director = require('./resolved/director');
 
var currentNav = null
  , navs = {
        github        :  github.init
      , blog          :  blog.init
      , about         :  about.init
    }
  ;

module.exports = navs;


function someFunctionDefinedAfterWrapper() {
  console.log('hello world');
}
