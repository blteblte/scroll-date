const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    new CleanWebpackPlugin(),
    new CopyPlugin([
      { from: './src/app/i-scroll-date.ts', to: 'i-scroll-date.ts' },
      { from: './src/app/global-declaration.ts', to: 'global-declaration.ts' },
      { from: './src/app/models/EventType.ts', to: 'models/EventType.ts' },
      { from: './src/app/models/EventListenerType.ts', to: 'models/EventListenerType.ts' },
      { from: './src/app/models/IDateData.ts', to: 'models/IDateData.ts' },
      { from: './src/app/models/Options.ts', to: 'models/Options.ts' },
      { from: './src/app/models/Translations.ts', to: 'models/Translations.ts' }
    ])
  ]
});
