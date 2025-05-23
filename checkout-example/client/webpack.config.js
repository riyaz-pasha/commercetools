const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const path = require('path');

const generalConfig = {
  watchOptions: {
    aggregateTimeout: 600,
    ignored: /node_modules/,
  },
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),  // Ensure output path is set
    filename: 'bundle.js'
  },
  devServer: {
    open: true,
    port: 3002,
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',             // ← Allows access from all interfaces
    allowedHosts: 'all',         // ← Crucial for bypassing the invalid Host header
    static: {
      directory: __dirname,
    },
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      protectWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ['dist'],
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
    }),
    new NodePolyfillPlugin(),
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new Dotenv({
      path: './.env',
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      'crypto-browserify': require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
    },
  },
}

module.exports = () => {
  return [generalConfig]
}
