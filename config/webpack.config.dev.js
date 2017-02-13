var merge = require('webpack-merge')
var base = require('./webpack.config.base')

var outputFile = 'vue-supply'
var globalName = 'VueSupply'

module.exports = merge(base, {
  output: {
    path: './dist',
    filename: outputFile + '.common.js',
    library: globalName,
    libraryTarget: 'umd',
  },
  devtool: 'eval-source-map',
})
