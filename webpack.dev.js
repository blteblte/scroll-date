const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    port: 3000
  },
  module: {
    rules: [
      {
          test: /\.scss$/,
          use: [
            /* creates style nodes from JS strings */
            { loader: 'style-loader' }
            /* extract css to files */
            //, { loader: MiniCssExtractPlugin.loader }
            /* translates CSS into CommonJS */
            , { loader: 'css-loader?-url', options: { sourceMap: true } }
            /* apply postcss plugins (./postcss.config.js) */
            , { loader: 'postcss-loader', options: { sourceMap: true } }
            /* compiles Sass to CSS */
            , { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  }
});
