# browserify-ftw [![build status](https://secure.travis-ci.org/thlorenz/browserify-ftw.png)](http://travis-ci.org/thlorenz/browserify-ftw)

Discovered [browserify](https://github.com/substack/node-browserify) too late and/or want to use common code on server
and client?

Think you are stuck in requirejs AMD format for client side code because there is no time to do the huge refactor?

Don't you fret, browserify-ftw is here to help:

Once it is functional that is, so for now **move along, nothing to see here yet**.

# features

- converts all modules of a given project from requirejs AMD to commonjs (nodejs and thus browserify compatible)
- safe since it parses the code and pulls information from AST (not just search/replace which is error prone)
- options allow specifiying code style to use for generated code
- adds proper relative paths deduced from requirejs `main.js` config
