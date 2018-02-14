# browserify-ftw [![build status](https://secure.travis-ci.org/thlorenz/browserify-ftw.png)](http://next.travis-ci.org/thlorenz/browserify-ftw)

<a href="https://www.patreon.com/bePatron?u=8663953"><img alt="become a patron" src="https://c5.patreon.com/external/logo/become_a_patron_button.png" height="35px"></a>

Discovered [browserify](https://github.com/substack/node-browserify) too late and/or want to share code on server
and client?

Think you are stuck with requirejs AMD format for your client side code because there is no time to do the huge refactor?

Don't you fret, `browserify-ftw` is here to help. For most projects it will be able to perform an upgrade it to a point
where it can be browserified immediately, for all others it should get you at least 90% there.

## warnings

Running browserify-ftw on your project **will rewrite the original files!**

Therefore you should **check all your files into source control** and best create a new branch before running it in order to be able to revert to the original state in case something goes wrong.

The **generated `shim.js` is incompatible with the newest browserify and browserify-shim**. Therefore it should only be
used as guideline to add the proper config to the `package.json` as explained
[here](https://github.com/thlorenz/browserify-shim#b-config-inside-packagejson-with-aliases).

## features

- converts all modules of a given project from requirejs AMD to commonjs (nodejs and thus browserify compatible)
- safe since it parses the code and pulls information from AST (not just search/replace which is error prone)
- refactor config allows specifiying code style to use for generated code
- adds proper relative paths deduced from requirejs `main.js` config
- generates proper `build.js` script which generated the browserify bundle
- shims commonJS incompatible modules like `jquery`

## limitations

- cannot resolve template files (maybe a good time to switch to [precompiled
  templates](https://github.com/wycats/handlebars.js/#precompiling-templates)) ;)
- `directoryFilter` not yet supported

## step by step examples

Additionally to the below documentation you will find the [step by step
examples](https://github.com/thlorenz/browserify-ftw/tree/master/examples) helpful.

## **Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [preparing requirejs config](#preparing-requirejs-config)
  - [shimmed modules](#shimmed-modules)
  - [npm modules](#npm-modules)
  - [local modules](#local-modules)
- [dry run](#dry-run)
- [preparing a custom refactor config](#preparing-a-custom-refactor-config)
- [running browserify-ftw](#running-browserify-ftw)
- [running the generated build script](#running-the-generated-build-script)

## preparing requirejs config

In order to improve browserify-ftw path resolution you should make some edits to the `paths` of your config inside your
requirejs config file.

The most important step is to set all vendor libraries that are available on [npm](https://npmjs.org/), (e.g.,
'underscore') paths to `null` and afterwards install them as `node_modules` and to shim all others.

This preparation step should be performed as follows:

### npm modules

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


### shimmed modules

In order to instruct `browserify-ftw` to shim a non-commonJS module, you need to include a shim config as part of your
requirejs config if it isn't part of it already. It has the exact same format as the [requirejs shim
config](http://requirejs.org/docs/api.html#config-shim). `deps` declarations will be ignored.

**Example:**

```js
require.config({ 
  shim: {
    jquery: { exports: '$' },
    // assuming foo is not published as an npm module, but commonJS compatible
    foo: { exports: null }
  },
  paths: {
      'jquery': 'modules/jquery',
      'foo': 'modules/foo'
  }
});
```

**Note:** When shimming modules, the generated `build.js` will require [browserify-shim](https://github.com/thlorenz/browserify-shim), 
so make sure to install it:

    npm install -S browserify-shim

### local modules

References not included in `paths` or set to `undefined` will be assumed to be in the or relative to the requirejs
config path.

**Example:**

```js
[ ... ]
  paths: {
    // omitting below line has the same effect since then 'mymodule' is undefined as well
    'mymodule': undefined
  }
``` 

- generates `require('./mymodule')` if `define(['mymodule'], ...` is found in another module that is also in the requirejs config path
- generates `require('../mymodule')` if `define(['mymodule'], ...` is found in another module that is in a folder one level below the requirejs config path
- since `'myothermodule'` is not mentioned in `paths` it is considered `undefined` and generated `require` statements are equivalent to the ones generated for `'mymodule'`
- dependency `'lib/mylib'` will be assumed to be at `'./lib/mylib'` (relative to requirejs config path)

## dry run

You can try a dry run via `browserify-ftw -r require-config.js -e ./entry.js`, which will use a default refactor config with
`dryrun` enabled.

## preparing a custom refactor config

Update the following file to match the style of your project and save it next to the `require-config.js` (i.e. as
`refactor-config.js`).

```js
module.exports = {
    quote           :  '\''         // '\'' or '"'
  , style           :  'var'        // 'var', 'comma', 'comma-first'
  , indent          :  2            // the tab size used in your project
  , directoryFilter :  null         // not supported yet
  , fileFilter      :  '.js'        // the extension of the file to upgrade
  , dryrun          :  true         // true|false if true no changes will be written to upgraded files
  , moveStrict      :  true         // true|false if true moves 'use strict;' statement to the top of the file
};
```

## running browserify-ftw

browserify-ftw has a very simple command line interface. Usage is available via `browserify-ftw`:

```sh
➜  browserify-ftw  
Options:
  -r, --requirejs  path to requirejs-config.js file                                             [required]
  -c, --config     path to config to be used for the refactoring                                [default: (built in refactor config)]
  -b, --build      path at which the generated browserify build script should be saved          [default: "./build.js"]
  -u, --bundle     path at which the bundle generated by the browserify build should be saved   [default: "./bundle.js"]
  -e, --entry      path at which the entry file for browserify will be located                  [required]
```

Therefore after you prepared your `require-config.js` and a `refactor-config.js` the following will upgrade your project
while printing information about which files are being upgraded:

    browserify-ftw -r require-config.js -c refactor-config.js -e entry.js -b ./build.js -u ./build/bundle.js

It should end with "Successfully upgraded your project.".

You can then use `valiquire .` in order to verify that all `require` statements are correct. Note that shimmed modules
are not found by valiquire, so you can safely ignore warnings about those (i.e., jquery).

If you don't have `valiquire` installed on your machine you can do so as follows:

    npm install -g valiquire

## running the generated build script

Assuming you installed `browserify` local to your project and if you shimmed modules, also `browserify-shim`, you can run the generated build
script in order to create the bundle file. 

You then need to change the sourced JavaScript file in your main HTML file e.g., index.html:

**Example:**

```html
  <script src="library/js/build/bundle.js"></script>
```

At this point should be ready to run your application.

For more details consult the [step by step examples](https://github.com/thlorenz/browserify-ftw/tree/master/examples).

