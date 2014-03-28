/* This comment block here is a placeholder for what would normally be a license 
 * block such as the MPL-2.0. After browserify-ftw rewrites this file, it should 
 * still be at the top of the file before the variable assignments.
 */

/* This is a comment block within the RequireJS wrapper. It should be 
 * preserved as well after conversion. 
 */
var director = require('./resolved/director');
var github = require('./resolved/github-index');
var blog = require('./resolved/blog-index');
var about = require('./resolved/about-index');
var githubContent = require('./resolved/github-content');
var blogContent = require('./resolved/blog-content');
var aboutContent = require('./resolved/about-content');
var foo;

var currentNav = null
  , navs = {
        github        :  github.init
      , blog          :  blog.init
      , about         :  about.init
    }
  ;

module.exports = navs;
