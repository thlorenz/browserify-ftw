'use strict';

var director = require('./resolved/director');

var currentNav = null;

var someObject = {
  funcName() {
    // this should work
  }
}

  // MDN example
function Person(){
  this.age = 0;

  setInterval(() => {
    this.age++; // |this| properly refers to the person object
  }, 1000);
}

var p = new Person();

module.exports = {
    github        :  github.init
  , blog          :  blog.init
  , about         :  about.init
};
