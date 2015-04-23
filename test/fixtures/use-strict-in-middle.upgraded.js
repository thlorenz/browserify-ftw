'use strict';

var director = require('./resolved/director');

var currentNav = null;

module.exports = {
    github        :  github.init
  , blog          :  blog.init
  , about         :  about.init
};
