define([ 'director' ], function (director) { 
  var currentNav = null;

  return {
      github        :  github.init
    , blog          :  blog.init
    , about         :  about.init
  };
});
