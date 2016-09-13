module.exports = {
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['modern', 'modern/safari9', 'babili']
        }
      }
    ]
  }
}
