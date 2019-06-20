const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
          test: /\.scss$/,
          use: [
            /* creates style nodes from JS strings */
            { loader: 'style-loader' }
            /* extract css to files */
            , { loader: MiniCssExtractPlugin.loader }
            /* translates CSS into CommonJS */
            , { loader: 'css-loader?-url' }
            /* apply postcss plugins (./postcss.config.js) */
            , { loader: 'postcss-loader' }
            /* compiles Sass to CSS */
            , { loader: 'sass-loader' }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
});
