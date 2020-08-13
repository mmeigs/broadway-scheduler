const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './client/index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  devServer: {
    publicPath: '/build/',
    proxy: {
      '*': 'http://localhost:3000',
      '/populate': 'http://localhost:3000',
      '/add': 'http://localhost:3000'
    },
    hot: true
  }
}