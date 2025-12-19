const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/lector.js',
  output: {
    filename: 'lector.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Lector',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  externals: {
    // Empêche le chargement de dépendances inutiles
    // qui pourraient causer des problèmes de chargement
    'fs': 'commonjs fs',
    'path': 'commonjs path'
  }
};
