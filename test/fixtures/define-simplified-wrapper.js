/* This comment block here is a placeholder for what would normally be a license 
 * block such as the MPL-2.0. After browserify-ftw rewrites this file, it should 
 * still be at the top of the file before the variable assignments.
 */

define(function (require) {
  /* This is a comment block within the RequireJS wrapper. It should be 
   * preserved as well after conversion. 
   */
  var director = require('director');
  var github = require('github-index');
  var blog = require('blog-index');
  var about = require('about-index');
  var githubContent = require('github-content');
  var blogContent = require('blog-content');
  var aboutContent = require('about-content');
  var foo;

  var currentNav = null
    , navs = {
          github        :  github.init
        , blog          :  blog.init
        , about         :  about.init
      }
    ;

  return navs;
});
