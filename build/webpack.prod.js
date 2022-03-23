const { merge } = require('webpack-merge')
const MiniCssPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const glob = require('glob') // 文件匹配模式

const { base, PATHS } = require('./webpack.base')

const config = merge(base, {
  devtool: 'eval',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssPlugin.loader, // 将css 通过css引入
          'cache-loader', // 缓存
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
  plugins: [
    // css抽离插件
    new MiniCssPlugin({
      filename: '[name].[hash:8].css',
    }),
    // css 剔除无用
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
    // 构建结果分析
    new BundleAnalyzer({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件
    }),
  ],
})
module.exports = (env, argv) => {
  console.log('env=>', env)
  console.log('argv.mode=>', argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config
}
