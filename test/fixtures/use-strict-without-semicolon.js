define([ 'director' ], function (director) {
  'use strict'

  var currentNav = null

  return {
      github        :  github.init
    , blog          :  blog.init
    , about         :  about.init
  };
})
