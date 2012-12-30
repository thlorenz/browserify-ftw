**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Example-RequireJS-jQuery-Project](#example-requirejs-jquery-project)
	- [Converting from requirejs AMD to commonjs format](#converting-from-requirejs-amd-to-commonjs-format)
		- [Adapting the requirejs config file](#adapting-the-requirejs-config-file)
		- [Adapting the entry file](#adapting-the-entry-file)
		- [Preparing the browserify-ftw refactor config file](#preparing-the-browserify-ftw-refactor-config-file)
		- [Preparing build directory](#preparing-build-directory)
		- [Running browserify-ftw](#running-browserify-ftw)
	- [Creating a proper npm package and running browserify](#creating-a-proper-npm-package-and-running-browserify)
		- [Initializing the npm package and installing dependencies](#initializing-the-npm-package-and-installing-dependencies)
		- [Running the generated browserify build script](#running-the-generated-browserify-build-script)
		- [Updating the file used in the web page](#updating-the-file-used-in-the-web-page)

# Example-RequireJS-jQuery-Project

This example can be found [here](https://github.com/ryanfitzer/Example-RequireJS-jQuery-Project). It is authored using
the requirejs AMD format and we will browserify it.

First you should clone it and go into its root folder:

    git clone https://github.com/ryanfitzer/Example-RequireJS-jQuery-Project ryanfitzer 
    cd ryanfitzer

## Converting from requirejs AMD to commonjs format

A few steps are necessary to enable browserify-ftw to do its job.

### Adapting the requirejs config file

The requirejs configuration is inside the `library/js` folder, so lets head there first:

    cd library/js 

Update it so `require-config.js` looks like the below:

```js
require.config({ 
  shim: {
    jquery: { exports: '$' }
  },
  paths: {
      'jquery': 'modules/jquery'
  }
});
```

We reduced it to only include the information necessary for `browserify-ftw` to fix all `require` statements and
generate a `browserify` build script.

As you can see we added shim information (normally this would have been included in the requirejs config already, but in
this case it wasn't). This information is necessary in order for browserify-ftw to properly shim jquery using
[browserify-shim](https://github.com/thlorenz/browserify-shim) in order to be required as if it was commonJS compatible.

### Adapting the entry file

Right now the requirejs entry file `home.js` has nested requirejs wrappers. This doesn't make sense in commonJS land and
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

At this point you can try a dry run via `browserify-ftw -r require-config.js -e home.js`, which will use a default refactor config with
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

### Preparing build directory

In order for our code that is generated (built) by browserify to be clearly separate from our source code, we create a
build diretory:

    mkdir build

### Running browserify-ftw

Since now we are setup, we can run `browserify-ftw`, passing the necessary arguments as follows:

    browserify-ftw -r require-config.js -c refactor-config.js -e home.js -b ./build.js -u ./build/bundle.js

- `-r` defines the requirejs-config that browserify-ftw will use 
- `-c` defines the refactor config that browserify-ftw will use
- `-e` defines what entry file browserify will use when building the `bundle.js`
- `-b` defines where to save the generated browserify build script
- `-u` defines where the `bundle.js` file is to be saved to when the `build.js` script is run

When we execute this command, browserify-ftw prints some information regarding about which files were upgraded and
should end with a snippet of the generated `build.js` script and finally with:

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

We can use `valiquire .` in order to verify that all `require` statements are correct.
This will display some errors, all about `jquery` not being found, which is something we will fix next.

If you don't have `valiquire` installed on your machine you can do so as follows:

    npm install -g valiquire

## Creating a proper npm package and running browserify

### Initializing the npm package and installing dependencies

In order for the next steps to succeed, we need to initialize this app as a proper npm package from its root folder:

    cd ../..
    npm init

Confirm each default by pressing `<Enter>` to have a `package.json` created for you. Next we wil install necessary
packages:

    npm install -S browserify browserify-shim

**Note:** we don't install browserify globally since it is used as a library inside our `build.js` script and not as a
command line tool.

### Running the generated browserify build script

    node ./library/js/build.js

should print "Success!"

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
