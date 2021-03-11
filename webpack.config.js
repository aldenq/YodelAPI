
module.exports = {
  entry: './dist/yodel.js',
  mode: "production",
  devtool: "source-map",
  output: {
    filename: 'yodel.js',
    library: 'yodel',
    libraryTarget: 'var',
  },
  optimization : {
    minimize: true
  }
};