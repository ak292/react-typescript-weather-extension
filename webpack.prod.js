const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  /* its important to differentiate between production and
  development because the final size of the chrome extension
  is way smaller and more optimized by webpack in prod mode */
  mode: "production",
});
