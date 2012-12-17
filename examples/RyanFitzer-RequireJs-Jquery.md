**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Converting from requirejs AMD to commonjs format](#converting-from-requirejs-amd-to-commonjs-format)
  - [Adapting the requirejs config file](#adapting-the-requirejs-config-file)
  - [Adapting the entry file](#adapting-the-entry-file)
  - [Preparing the browserify-ftw refactor config file](#preparing-the-browserify-ftw-refactor-config-file)
  - [Running browserify-ftw](#running-browserify-ftw)
- [Creating a proper package and running browserify](#creating-a-proper-package-and-running-browserify)
  - [Initializing the npm package and installing dependencies](#initializing-the-npm-package-and-installing-dependencies)
  - [Creating and running a browserify build script](#creating-and-running-a-browserify-build-script)
  - [Updating the file used in the web page](#updating-the-file-used-in-the-web-page)

# Example-RequireJS-jQuery-Project

This example can be found [here](https://github.com/ryanfitzer/Example-RequireJS-jQuery-Project).

First you should clone it and go into its root folder:

    git clone https://github.com/ryanfitzer/Example-RequireJS-jQuery-Project ryanfitzer 
    cd ryanfitzer

## Converting from requirejs AMD to commonjs format

A few steps are necessary to enable browserify to do its job.

### Adapting the requirejs config file

The requirejs configuration is inside the `library/js` folder, so lets head there first:

    cd library/js 

Open `require-config.js` in your favorite editor and look at the `paths`.

```js
[..]
paths: {
    'jquery': 'modules/jquery'
},
[..]
```

Since we will be using a node module that wraps jquery, we want to require jquery as a global. Therefore we set its path
to `null`.

```js
[..]
paths: {
    'jquery': null
},
[..]
```

### Adapting the entry file

Right now the requirejs entry file `home.js` has nested requirejs wrappers. This doesn't make sense in commonjs land and
browserify-ftw may have problems with that also.

Change the content of the file until it looks like so:

```js
require(
    [   
        'jquery',
        'modules/logger',
        'modules/alpha',
        'modules/beta',
    ],

    function(
        $,
        logger
    ) {
        
        logger( 'home', arguments );
    }
);
```

### Preparing the browserify-ftw refactor config file

For the following steps you need to have `browserify-ftw` installed. So if you haven't done so, now is a good time:

    npm -g install browserify-ftw

At this point you can try a dry run via `browserify require-config.js`, which will use a default refactor config with
`dryrun` enabled.

In order for browserify-ftw to generate code that conforms to the rest of your project, we need to give it some
guidelines in form of a custom refactor-config file:

Therefore place the following inside `refactor-config.js`.

```js
module.exports = {
    quote           :  '\''         
  , style           :  'var'        
  , indent          :  4            
  , directoryFilter :  null         
  , fileFilter      :  '.js'        
  , dryrun          :  false        
};
```

If you set `dryrun` to true, browserify-ftw will tell you what file would be upgraded, but doesn't actually do so.

The `indent` sets the tab size to be assumed inside the files that are going to be refactored and the quote determines
how your require statements look, e.g., `require('./foo')` or `require("./foo")`.

`'var'` is the only available style at this point.

### Running browserify-ftw

Since now we are setup, we can run browserify-ftw, passing the requirejs config as first and our refactor config as
second argument as follows:

    browserify-ftw require-config.js refactor-config.js

This prints some information regarding about which files were upgraded and should end with:
"Successfully upgraded your project."

The following files have been upgraded: 

``` sh
home.js
modules/adapters/jquery.js
modules/alpha.js
modules/beta.js
modules/logger.js
require-config.js
```

As an example `home.js` now looks similar to:

```js
var $ = require('jquery');
var logger = require('./modules/logger');
require('./modules/alpha');
require('./modules/beta');

logger( 'home', arguments );
```

We can use `valiquire` (`npm -g install valiquire`) in order to verify that all `require` statements are correct.
This will display some errors, all about `jquery` not being found, which is something we will fix next.

## Creating a proper package and running browserify

### Initializing the npm package and installing dependencies

In order for the next steps to succeed, we need to initialize this app as a proper npm package from its root folder:

    cd ../..
    npm init

Confirm each default by pressing `<Enter>` to have a `package.json` created for you. Next we wil install necessary
packages:

    npm install browserify
    npm install br-jquery

The last one, `br-jquery` wraps the `jquery` we know so it works like a commonjs module. Find more information
[here](https://github.com/benatkin/br-jquery).

### Creating and running a browserify build script

We now need to write a short script that will `browserify` our javascript files.

Inside the current folder (the root of the project) create `build.js` and enter the following:

```js
var js = require('browserify') ({
    require :  { jquery : 'br-jquery' } // require br-jquery and use it wherever jquery is required
  , entry   :  'library/js/home.js'     // entry point for browserify to find all our javascript
  , debug   :  true                     // yes, we'd like source maps
}).bundle();

require('fs').writeFileSync('library/js/build/bundle.js', js, 'utf-8');

console.log('Success!');
```

We will store the built file inside `library/js/build` in order to keep it separate from our source files. Lets create
that folder now:

    mkdir library/js/build

Now run our build script:

    node build.js

which should print "Success!"

### Updating the file used in the web page

As a final step we edit `index.html` inside the current folder and change the line:

```html
<script src="library/js/require.js" data-main="library/js/home"></script>
```
to:
```html
  <script src="library/js/build/bundle.js"></script>
```

and open it inside the browser: `open index.html`.

Voila, we should see a simple looking page. Most notably it will contain:


1. **modules/alpha** factory has executed.
2. **modules/beta** factory has executed.
3. **home factory** has executed.

which tells us that all JavaScript files have successfully executed.

Opening your developer tools and looking at the source tab, you should see all your JavaScript files listed separately
thanks to the power of source maps.
