const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const chalk = require('chalk');

const glob = require('glob'); // 文件匹配模式

const resolve = (dir) => path.resolve(__dirname, dir);
const PATHS = {
  src: resolve('src'),
  dist: resolve('dist'),
  tsConfig: resolve('./tsconfig.json'),
  public: resolve('public')
};

const config = {
  entry: resolve('src/index.ts'),
  devtool: 'source-map', // 开启source-map
  mode: 'development', // production   development none
  stats: {
    // 管理输出
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  },
  resolve: {
    // 路径别名
    alias: {
      // vue$: 'vue/dist/vue.esm.js',
      '@': PATHS.src,
      '~': PATHS.src
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json', '.wasm'], // 引入时，不加入后缀
    modules: [PATHS.src, 'node_modules'] // 优先搜索src目录
  },
  externals: {
    jquery: 'jQuery' // 从cdn打包
  },
  cache: {
    // webpack5的缓存策略
    type: 'filesystem' //详细看根据这个 https://webpack.docschina.org/configuration/cache/#root
  },
  output: {
    filename: 'boundle.js',
    path: PATHS.dist,
    clean: true // 每次打包清理目录
  },
  module: {
    noParse: /jquery|lodash/, //忽略模块文件中不会解析require和import语法
    rules: [
      {
        test: /\.jsx$/i,
        include: PATHS.src, // 需要解析的
        exclude: /node_modules/, // 排除解析
        use: [
          {
            loader: 'thread-loader', // 多线程打包
            options: {
              worker: 3 // 开启三个线池打包
            }
          },
          'babel-loader'
        ]
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          // "style-lodaer",
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
              }, //开启css模块化
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: '[name][hash:8][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024 //超过50kb不转 base64
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          filename: '[name][hash:8][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 超过10kb不转 base64
          }
        }
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
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
              transpileOnly: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      template: './public/index.html'
    }),
    // css抽离插件
    new MiniCssPlugin({
      filename: '[name].[hash:8].css'
    }),
    // css 剔除无用
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    }),
    // 构建结果分析
    new BundleAnalyzer({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true // 是否生成stats.json文件
    }),
    new ProgressBarPlugin({
      complete: '█',
      format: `${chalk.green('Building')} [ ${chalk.green(':bar')} ] ':msg:' ${chalk.bold('(:percent)')}`,
      clear: true
    }),
    new VueLoaderPlugin(), // 解析vueSFC
    new ForkTsCheckerWebpackPlugin()
  ],
  devServer: {
    static: {
      directory: PATHS.public
    },
    hot: true, // 开启热替换
    compress: true, //是否启动压缩 gzip
    port: 8080, // 端口号
    open: true // 是否自动打开浏览器
  },
  optimization: {
    minimize: true,
    minimizer: [
      // 压缩css
      new OptimizeCssAssetsPlugin({}),
      new TerserPlugin({}) // 压缩js
    ],
    // 分包配置
    splitChunks: {
      chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
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
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};

module.exports = (env, argv) => {
  console.log('env=>', env);
  console.log('argv.mode=>', argv.mode); // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config;
};
