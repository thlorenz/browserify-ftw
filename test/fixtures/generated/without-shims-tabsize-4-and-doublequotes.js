var browserify = require("browserify");
var fs = require("fs");

var bundled = browserify({ debug: true })
    .addEntry("./js/entry.js")
    .bundle();

fs.writeFileSync("./build/bundle.js", bundled, "utf-8");
