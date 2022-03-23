const { merge } = require('webpack-merge')

const { base, PATHS } = require('./webpack.base')

const config = merge(base, {
  devtool: 'source-map', // 开启source-map
  mode: 'development',
  stats: {
    // 管理输出
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
  },
  devServer: {
    static: {
      directory: PATHS.public,
    },
    hot: true, // 开启热替换
    compress: true, // 是否启动压缩 gzip
    port: 8080, // 端口号
    open: true, // 是否自动打开浏览器
  },
  module: {
    noParse: /jquery|lodash/, // 忽略模块文件中不会解析require和import语法
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'cache-loader',
          }, // 缓存
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local', // 控制应用于输入样式的编译级别
                auto: true, // 基于名字开启模块化
                // exportGlobals: true,
                localIdentName: '[name][hash:base64]',
                // localIdentContext: path.resolve(__dirname, 'src'),
                // localIdentHashSalt: 'my-custom-hash',
                // namedExport: true,
                // exportLocalsConvention: 'camelCase',
                // exportOnlyLocals: false
              }, // 开启css模块化
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [],
})
module.exports = (env, argv) => {
  console.log('env=>', env)
  console.log('argv.mode=>', argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config
}
