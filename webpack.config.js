const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: path.resolve("src/popup/popup.tsx"),
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx?$/,
        exclude: /node_modules/,
      },
    ],
  },
  /* 3rd party library installed, have to add it as a plugin
  copies static files (in this case manifest.json) and
  outputs it to our dist folder */
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/manifest.json"),
          to: path.resolve("dist"),
        },
      ],
    }),
    /* 3rd party plugin to build and output our HTML file
    (using our jsx/tsx) to our dist folder, its similar to
    the above plugin but specifically designed for HTML */
    new HtmlPlugin({
      title: "React Extension",
      filename: "popup.html",
      /* a chunk is a single js file being output by webpack
      one webpack configuration can output multiple chunks
      we are injecting the popup (javascript file) chunk
      into our popup.html which is the filename above
      it just injects a popup.js script tag into our HTML */
      chunks: ["popup"],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    // [name] is special Webpack syntax to output the name
    // of the specific chunk files automatically
    filename: "[name].js",
    path: path.resolve("dist"),
  },
};
