define(function (require) { 
  var director = require('director');
  var github = require('github-index');
  var blog = require('blog-index');
  var about = require('about-index');
  var githubContent = require('github-content');
  var blogContent = require('blog-content');
  var aboutContent = require('about-content');

  var currentNav = null
    , navs = {
          github        :  github.init
        , blog          :  blog.init
        , about         :  about.init
      }
    ;

  return navs;
});
