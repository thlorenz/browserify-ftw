# browserify-ftw [![build status](https://secure.travis-ci.org/thlorenz/browserify-ftw.png)](http://travis-ci.org/thlorenz/browserify-ftw)

Discovered [browserify](https://github.com/substack/node-browserify) too late and/or want to use common code on server
and client?

Think you are stuck with requirejs AMD format for your client side code because there is no time to do the huge refactor?

Don't you fret, browserify-ftw is here to help. For most projects it will be able to perform an upgrade it to a point
where it can be browserified immediately, for all others it should get you at least 90% there.

## Warning

Running browserify-ftw on your code will rewrite the original files!

Therefore you should check all you files into source control and best create a new branch before running it in order to be able to revert to the original state in case something goes wrong.

## features

- converts all modules of a given project from requirejs AMD to commonjs (nodejs and thus browserify compatible)
- safe since it parses the code and pulls information from AST (not just search/replace which is error prone)
- refactor config allows specifiying code style to use for generated code
- adds proper relative paths deduced from requirejs `main.js` config

## limitations

- will not wrap your jquery, etc., for you, you'll need to do this by hand
- cannot resolve template files (maybe a good time to switch to [precompiled
  templates](https://github.com/wycats/handlebars.js/#precompiling-templates)) ;)
- only `'var foo = require('foo');'` require style supported at this point
- `directoryFilter` not yet supported

## step by step examples

Additionally to the below documentation you will find the [step by step
examples](https://github.com/thlorenz/browserify-ftw/tree/master/examples) helpful.

## **Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [preparing requirejs config](#preparing-requirejs-config)
  - [global modules](#global-modules)
  - [local modules](#local-modules)
- [dry run](#dry-run)
- [preparing a custom refactor config](#preparing-a-custom-refactor-config)
- [running browserify-ftw](#running-browserify-ftw)


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

## dry run

You can try a dry run via `browserify require-config.js`, which will use a default refactor config with
`dryrun` enabled.

## preparing a custom refactor config

Update the following file to match the style of your project and save it next to the `require-config.js` (i.e. as
`refactor-config.js`).

```js
module.exports = {
    quote           :  '\''         // '\'' or '"'
  , style           :  'var'        // 'var', 'comma', 'comma-first' (so far only var is supported)
  , indent          :  2            // the tab size used in your project
  , directoryFilter :  null         // not supported yet
  , fileFilter      :  '.js'        // the extension of the file to upgrade
  , dryrun          :  true         // true|false if true no changes will be written to upgraded files
};
```

## running browserfiy-ftw

browserify-ftw has a very simple command line interface:

    browserify require-config [refactor-config]

Therefore after you prepared your `require-config.js` and a `refactor-config.js` the following will upgrade your project
while printing information about which files are being upgraded:

    browserify require-config.js refactor-config.js

It should end with "Successfully upgraded your project.".

You can then use `valiquire .` (`npm -g install valiquire`) in order to verify that all `require` statements are correct.

