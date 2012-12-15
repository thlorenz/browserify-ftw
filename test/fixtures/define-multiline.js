define(
  [ 'director'
  , 'github-index' 
  , 'blog-index'
  , 'about-index'
  , 'github-content'
  , 'blog-content'
  , 'about-content'
  ], 
function (director, github, blog, about, githubContent, blogContent, aboutContent) { 
  var currentNav = null
    , navs = {
          github        :  github.init
        , blog          :  blog.init
        , about         :  about.init
      }
    ;

  return navs;
});
