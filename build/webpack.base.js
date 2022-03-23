const Webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const chalk = require('chalk')

const resolve = dir => path.resolve(__dirname, dir)
const PATHS = {
  src: resolve('../src'),
  dist: resolve('../dist'),
  tsConfig: resolve('../tsconfig.json'),
  public: resolve('../public'),
  entry: resolve('../src/index.ts'),
  htmlTemplate: resolve('../public/index.html'),
}

const config = {
  entry: PATHS.entry,
  resolve: {
    // 路径别名
    alias: {
      // vue$: 'vue/dist/vue.esm.js',
      '@': PATHS.src,
      '~': PATHS.src,
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.wasm'], // 引入时，不加入后缀
    modules: [PATHS.src, 'node_modules'], // 优先搜索src目录
  },
  externals: {
    jquery: 'jQuery', // 从cdn打包
  },
  cache: {
    // webpack5的缓存策略
    type: 'filesystem', // 详细看根据这个 https://webpack.docschina.org/configuration/cache/#root
  },
  output: {
    filename: '[name].[hash:8].js',
    path: PATHS.dist,
    clean: true, // 每次打包清理目录
  },
  module: {
    noParse: /jquery|lodash/, // 忽略模块文件中不会解析require和import语法
    rules: [
      {
        test: /\.(mjs|js|jsx)$/i,
        include: PATHS.src, // 需要解析的
        type: 'javascript/auto',
        exclude: /node_modules/, // 排除解析
        resolve: {
          fullySpecified: false, // disable the behaviour
        },
        use: [
          {
            loader: 'thread-loader', // 多线程打包
            options: {
              worker: 3, // 开启三个线池打包
            },
          },
          'babel-loader',
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: '[name][hash:8][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, // 超过50kb不转 base64
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: '[name][hash:8][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 超过10kb不转 base64
          },
        },
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              // 指定特定的ts编译配置，为了区分脚本的ts配置
              // 注意这里的路径问题，按照自己项目来配置
              configFile: PATHS.tsConfig,
              // appendTsSuffixTo: [/\.vue$/], // 自动将vue变成jsx
              /* 只做语言转换，而不做类型检查, 这里如果不设置成TRUE，就会HMR 报错 */
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(), // 解析vueSFC
    new HtmlPlugin({
      template: PATHS.htmlTemplate,
    }),
    new ProgressBarPlugin({
      complete: '█',
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`,
      clear: true,
    }),
    new ForkTsCheckerWebpackPlugin(),
    new Webpack.DefinePlugin({
      __my__value: JSON.stringify('这是我定义的全局变量'),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // 压缩css
      new OptimizeCssAssetsPlugin({}),
      new TerserPlugin({}), // 压缩js
    ],
    // 分包配置
    splitChunks: {
      chunks: 'async', // 有效值为`all`，`async`和`initial`
      minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
      minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
      minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
      maxAsyncRequests: 30, // 最大的按需(异步)加载次数
      maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
}

module.exports = { base: config, PATHS, resolve }
