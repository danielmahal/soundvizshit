module.exports = {
  context: __dirname + '/src',
  entry: './index.js',

  output: {
    path: __dirname + '/build',
    filename: 'index.js'
  },

  module: {
    loaders: [
      { test: /.(frag|vert)$/, loader: 'raw' }
    ]
  }
}