define([ 'director' ], function (director) {
  var currentNav = null;

  'use strict';

  return {
      github        :  github.init
    , blog          :  blog.init
    , about         :  about.init
  };
});
