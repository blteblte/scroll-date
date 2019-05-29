const postCssPlugins = [
  require('autoprefixer') // auto-prefix css
]

if ((process.env.NODE_ENV || '').trim() === 'production') {
  // minify css
  postCssPlugins.push(require('postcss-clean'))
}

module.exports = {
  plugins: postCssPlugins
}
