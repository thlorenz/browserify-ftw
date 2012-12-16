# browserify-ftw [![build status](https://secure.travis-ci.org/thlorenz/browserify-ftw.png)](http://travis-ci.org/thlorenz/browserify-ftw)

Discovered [browserify](https://github.com/substack/node-browserify) too late and/or want to use common code on server
and client?

Think you are stuck in requirejs AMD format for client side code because there is no time to do the huge refactor?

Don't you fret, browserify-ftw is here to help:

Once it is functional that is, so for now **move along, nothing to see here yet**.

## features

- converts all modules of a given project from requirejs AMD to commonjs (nodejs and thus browserify compatible)
- safe since it parses the code and pulls information from AST (not just search/replace which is error prone)
- options allow specifiying code style to use for generated code
- adds proper relative paths deduced from requirejs `main.js` config

## preparing requirejs config

In order to improve browserify-ftw path resolution you should make some edits to the `paths` of your config inside your
requirejs config file.

The most important step is to set all vendor librarie's (e.g., 'underscore') paths to `null` and afterwards install them
as `node_modules`.

This preparation step should be performed as follows:

### global modules

Set all paths that should become global requires to `null`. You should do this for or modules that you will be
installing as `node_modules`.

**Example:**

```js
[ ... ]
  paths: {
    // we'll use the underscore node_module
    'underscore': null
  }
``` 

- generates `require('underscore')` wherever `define(['underscore'], ...` is found

### local modules

References not included in `paths` or set to `undefined` will be assumed to be in the or relative to the requirejs config path

**Example:**

```js
[ ... ]
  paths: {
    // omitting below line has the same effect since then 'mymodule' is undefined as well
    'mymodule': undefined
  }
``` 

- generates `require('./mymodule')` if `define(['mymodule'], ...` is found in another module that is also in the
  requirejs config path
- generates `require('../mymodule')` if `define(['mymodule'], ...` is found in another module that is in a folder one
  level below the requirejs config path
- since `'myothermodule'` is not mentioned in `paths` it is considered `undefined` and generated `require` statements
  are equivalent to the ones generated for `'mymodule'`
- dependency `'lib/mylib'` will be assumed to be at `'./lib/mylib'` (relative to requirejs config path)


