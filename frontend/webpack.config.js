const webpack = require('webpack');

module.exports = {
  // إعدادات Webpack الأخرى هنا
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    })
  ]
};