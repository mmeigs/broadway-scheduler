const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: [path.resolve(__dirname, './client/index.js'), './client/stylesheets/styles.css'],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
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
    contentBase: path.join(__dirname, 'build'),
    proxy: {
      '*': 'http://localhost:3000',
      '/populate': 'http://localhost:3000',
      '/add': 'http://localhost:3000'
    },
    hot: true
  }
}