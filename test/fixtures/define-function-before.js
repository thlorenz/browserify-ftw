function someFunctionDefinedBeforeWrapper() {
  console.log('hello world');
}

define([ 'director' ], function (director) { 
  var currentNav = null
    , navs = {
          github        :  github.init
        , blog          :  blog.init
        , about         :  about.init
      }
    ;

  return navs;
});
