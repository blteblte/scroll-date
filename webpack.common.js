const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

let multiplesFiles = [
  { name: 'en', title: 'English Example', path: './src/en.html' },
  { name: 'he', title: 'Hebrew Example', path: './src/he.html' }
].map(file => (new HtmlWebpackPlugin({
    title: file.title,
    filename: file.name + '.html',
    template: `${file.path}`
})));

module.exports = {
  entry: {
    ['scroll-date']: './src/app/app.ts'
  },
  /* loaders */
  module: {
    rules: [
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'ts-loader'
            }
        },
        {
            test: /\.html$/,
            use: [
                {
                    loader: 'html-loader',
                    options: { minimize: false }
                }
            ]
        }
    ]
  },
  resolve: {
      extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    ...multiplesFiles,
    new MiniCssExtractPlugin({
        filename: '[name].min.css',
        chunkFilename: 'chunks/[id].css'
    }),
    new WebpackNotifierPlugin({
      contentImage: path.join(__dirname, '/src/assets/logo.png')
    })
  ],
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist')
  }
};
