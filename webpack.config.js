var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/client/index.html',
  filename: 'index.html',
  inject: 'body'
});
var path = require('path');

module.exports = {
  entry: [
    './client/index.js'
  ],
  output: {
    filename: 'index_bundle.js',
    path: __dirname + '/client/dist'
  },
  cache: true,
  debug: true,
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/, include: __dirname + '/client', loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: __dirname + '/client'
      }
      // ,
      // {
        // test: /\.dae$/, include: __dirname + '/client/assets', loader: 'threejs-modelmultiloader'

      // }
    ]
  },
  plugins: [HTMLWebpackPluginConfig]
}
