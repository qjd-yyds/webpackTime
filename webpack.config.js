const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  mode: 'development', // production   development
  output: {
    filename: 'boundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true // 每次打包清理目录
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './public/index.html'
    })
  ]
};
