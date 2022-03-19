// ./babelrc.js
module.exports = function (api) {
  api.cache(true); // 开启二次构建缓存
  const presets = [
    [
      '@babel/preset-env',
      {
        // module: false, // 开启tree-shaking 配置后报错。。
        // useBuiltIns: false 默认值，无视浏览器兼容配置，引入所有 polyfill
        // useBuiltIns: entry 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
        // useBuiltIns: usage 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
        useBuiltIns: 'entry',
        corejs: '3.9.1', // 是 core-js 版本号
        targets: {
          chrome: '58',
          ie: '11'
        }
      }
    ]
  ];
  const plugins = [
    [
      '@vue/babel-plugin-jsx',
      {
        transformOn: false, // 把on: { click: xx } 转成 onClick: xxx
        optimize: false,
        mergeProps: true,
        enableObjectSlots: true // 启动插槽
      }
    ],
    // js装饰器
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
    // ['@babel/plugin-proposal-class-properties', { loose: true }]
  ];
  return {
    presets,
    plugins
  };
};
