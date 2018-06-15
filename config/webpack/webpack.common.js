'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const webpack              = require('webpack');
const CleanPlugin          = require('clean-webpack-plugin');
const HtmlPlugin           = require('html-webpack-plugin');
const ProgressBarPlugin    = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NotifierPlugin       = require('webpack-notifier');
const helpers              = require('./helpers');

module.exports = {
  stats: { children: false },

  entry: {
    app: './src/app/app.js',
    vendor: './src/app/vendor.js'
  },

  resolve: {
    extensions: ['.js']
  },

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js'
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.pug$/,
        exclude: /(node_modules)/,
        loaders: [
          'raw-loader',
          'pug-html-loader'
        ]
      },
      {
        test: /\.css$/,
        loader: 'raw-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?minify'
        ]
      },
      {
        test: /\.styl$/,
        exclude: /(node_modules)/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?minify',
          'stylus-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'file-loader?name=images/[name].[ext]'
      },
      {
        test: /\.(svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },

  plugins: [
    new CleanPlugin(['dist'], {
      root: helpers.root(),
      verbose: false,
      dry: false
    }),

    // TODO: required?
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
      helpers.root('src', 'app')
    ),

    new HtmlPlugin({
      template: 'src/public/index.pug'
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }),

    new ProgressBarPlugin({
      format: 'Build [:bar] :percent (:elapsed seconds)',
      clear: false,
    }),

    new NotifierPlugin({
      title: 'app',
      excludeWarnings: true,
      skipFirstNotification: true
    })
  ]
};
