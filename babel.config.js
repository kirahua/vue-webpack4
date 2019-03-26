const presets = [
  ["@babel/env", {
    targets: {
      "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
    },
    corejs: 3,
    useBuiltIns: "usage"
  }]
];

const plugins = [
];

module.exports = {
  presets,
  plugins
};
