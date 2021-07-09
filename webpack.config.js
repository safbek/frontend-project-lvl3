const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.js',
  // entry: [
  //   './node_modules/jquery/dist/jquery.js',
  //   './node_modules/popper.js',
  //   './node_modules/bootstrap/dist/js/bootstrap.js',
  //   './src/index.js',
  // ],
  // externals: {
  //   jQuery: 'jQuery',
  // },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template.html',
    }),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    // }),
  ],

};
