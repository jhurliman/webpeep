module.exports = {
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['modern-browsers', 'minify']
        }
      }
    ]
  }
}
