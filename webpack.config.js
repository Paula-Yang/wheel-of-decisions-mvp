// const path = require('path');

// module.exports = {
//   entry: './src/index.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'bundle.js'
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: 'babel-loader'
//       }
//     ]
//   },
//   devServer: {
//     contentBase: path.resolve(__dirname, 'dist'),
//     port: 3001,
//     open: true,
//     hot: true
//   }
// };

var path = require("path");
var SRC_DIR = path.join(__dirname, "src");
var DIST_DIR = path.resolve(__dirname, "dist");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: "bundle.js",
    path: DIST_DIR,
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
    },
    ],
  },
};
