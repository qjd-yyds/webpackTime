// 各种sourcemap配置
module.exports = {
  eval: 'eval',
  sourceMap: 'source-map', // 打包速度慢 定位行列
  evalSourceMap: 'eval-source-map', // 通过eval执行，编译后的代码中定位到错误所在行列信息
  cheapSourceMap: 'cheap-source-map', 
  inlineSourceMap: 'inline-source-map',
  evalCheapSourceMap: 'eval-cheap-source-map', // 行信息 速度较快
  cheapModuleSourceMap: 'cheap-module-source-map',
  inlineCheapSourceMap: 'inline-cheap-source-map',
  evalCheapModuleSourceMap: 'eval-cheap-module-source-map', // 推荐
  inlineCheapModuleSourceMap: 'inline-cheap-module-source-map',
  hiddenSourceMap: 'hidden-source-map',
  nosourcesSourceMap: 'nosources-source-map'
};
