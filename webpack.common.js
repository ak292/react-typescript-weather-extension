const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    // this is where we define our chunks
    popup: path.resolve("src/popup/popup.tsx"),
    options: path.resolve("src/options/options.tsx"),
    background: path.resolve("src/background/background.ts"),
    contentScript: path.resolve("src/contentScript/contentScript.ts"),
  },
  module: {
    // set up the 3rd party loaders required to run each type of file
    // typescript files first one, css files second one
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx?$/,
        exclude: /node_modules/,
      },
      {
        use: ["style-loader", "css-loader"],
        test: /\.css$/i,
      },
      {
        // built in loader to automatically import png files etc
        // directly inside our typescript code
        type: "asset/resource",
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
      },
    ],
  },
  plugins: [
    //3rd party library to help clear out our dist folder
    // everytime we switch from prod to dev build etc
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    /* 3rd party library installed, have to add it as a plugin
    copies static folder (in this case manifest.json and icon.png) and
    outputs it to our dist folder */
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/static"),
          to: path.resolve("dist"),
        },
      ],
    }),

    // calls getHtml function with the result
    // being seperate instances for each input
    // as opposed to just being 1 array
    ...getHtmlPlugins(["popup", "options"]),
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
  // simple optimization to allow our chunks to share modules
  // for example if 2 chunks both import react & reactdom,
  // they can share a single module of them both instead of
  // importing them in both chunks/files (vendor files output from this)
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};

function getHtmlPlugins(chunks) {
  /* HtmlPlugins is a 3rd party plugin to build and output our HTML file
    (using our jsx/tsx) to our dist folder, its similar to
    the above plugin but specifically designed for HTML */
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: "React Extension",
        filename: `${chunk}.html`,
        /* a chunk is a single js file being output by webpack
        one webpack configuration can output multiple chunks
        we are injecting the popup (javascript file) chunk
        into our popup.html which is the filename above
        it just injects a popup.js script tag into our HTML */
        chunks: [chunk],
      })
  );
}
