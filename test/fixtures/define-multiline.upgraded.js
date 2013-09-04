var director = require('./resolved/director');
var github = require('./resolved/github-index');
var blog = require('./resolved/blog-index');
var about = require('./resolved/about-index');
var githubContent = require('./resolved/github-content');
require('./resolved/blog-content');
require('./resolved/about-content');

var currentNav = null
  , navs = {
        github        :  github.init
      , blog          :  blog.init
      , about         :  about.init
    }
  ;

module.exports = navs;
