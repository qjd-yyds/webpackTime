# webpack 配置

## hash

- hash 任何一个文件改动都会将构建的 hash 值修改
- chunkhash 文件改动只会影响所在 chunk 的 hash 值
- contenthash 每个文件都有自己的 hash 值，文件改动会影响自身 hash

## loader

- cache-loader 其他 loader 的缓存
- bebel-loader es6 语法转化，配置见.baberrc.js

## plugin

- speed-measure-webpack-plugin 构建分析 其他插件可能不兼容 需要降级
- mini-css-extract-plugin css 抽离
- html-webpack-plugin html 构建
