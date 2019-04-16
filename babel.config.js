module.exports = function (api) {
  api.cache(true);

  const presets = [
    ["@babel/preset-env", {
      targets: {
        browsers: [
          ">0.2%",
          "not dead",
          "not ie <= 11",
          "not op_mini all"
        ]
      },
      corejs: 2,
      useBuiltIns: "usage"
    }]
  ];

  const plugins = [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-transform-runtime",
    ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }] // 如果要做主题定制，需要修改为 style: true 别用引号！
  ];

  return {
    presets,
    plugins
  };
};
