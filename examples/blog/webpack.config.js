var path = require('path');

module.exports = {
  entry: {
    main: './js/main.js',
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      include: [
        path.resolve(__dirname, "js")
      ]
    }]
  },
  plugins: [
  ]
};
