const Path = require('path');

const electronConfig = {
  target: "electron-main",
  entry: "./src/main/index.js",
  output: {
    filename: 'main.js',
    path: Path.resolve(__dirname, "app"),
  },
};

const rendererConfig = {
  target: "electron-renderer",
  entry: "./src/renderer/index.js",
  output: {
    filename: 'renderer.js',
    path: Path.resolve(__dirname, "app"),
  },
  module: {
    rules: [{
      test: /\.s[ac]ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
      test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
      loader: 'url-loader',
      options: {
        limit: 8192
      }
    }]
  },
};

module.exports = function (env, argv) {
  if (argv.mode === 'development') {
    rendererConfig.module.rules[0].use = [
      {loader: 'style-loader'},
      {loader: 'css-loader', options: {url: false}},
      {loader: 'sass-loader'},
    ];
  }
  return [electronConfig, rendererConfig];
};
