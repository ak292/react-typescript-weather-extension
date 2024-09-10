const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

/* webpack merge module allows us to merge multiple webpack
    files which is helpful when your dev and prod webpack files
    are very similair with just a few changes */
module.exports = merge(common, {
  /* this object contains the changes between common file
    and this current file (development webpack file) */
  mode: "development",
  devtool: "cheap-module-source-map",
});
