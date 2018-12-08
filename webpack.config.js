// const path = require('path');
//
// module.exports = {
//   entry: {
//     main: "./lib/index.js",
//     test: "mocha!./test/index.js"
//   },
//   output: {
//     path: __dirname,
//     filename: "[name].bundle.js"
//   },
//   module: {
    // loaders: [
    //   { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
    //   { test: /\.css$/, loader: "style!css" },
    //   { test: /\.scss$/, loaders: ["style-loader", "css-loader", "sass-loader"] },
    // ]
//   },
//   resolve: {
//     extensions: ['', '.js', '.json', '.css', '.scss']
//   }
// };

const path = require('path');

module.exports = {
  mode: "development",
  entry: {
    main: "./lib/index.js",
    test: "mocha-loader!./test/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [{
      test: /\.js$/, // include .js files
      enforce: "pre", // preload the jshint loader
      exclude: /node_modules/, // exclude any and all files in the node_modules folder
      use: [{
        loader: "jshint-loader",
        // more options in the optional jshint object
        options: {  // ⬅ formally jshint property
          camelcase: true,
          emitErrors: false,
          failOnHint: false
        }
      }]
    }]
  },
};
