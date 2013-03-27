var director = require('./resolved/director'),
  github = require('./resolved/github-index'),
  blog = require('./resolved/blog-index'),
  about = require('./resolved/about-index'),
  githubContent = require('./resolved/github-content'),
  blogContent = require('./resolved/blog-content'),
  aboutContent = require('./resolved/about-content');

var currentNav = null
  , navs = {
        github        :  github.init
      , blog          :  blog.init
      , about         :  about.init
    }
  ;

module.exports = navs;
