var director = require('./resolved/director');

'use strict';

var currentNav = null;

module.exports = {
    github        :  github.init
  , blog          :  blog.init
  , about         :  about.init
};
