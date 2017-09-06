var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProduction = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  entry: isProduction
    ? {
      'assets/app': './client/main.js',
    }
  : {
    'assets/app': './client/main.js',
    'assets/hot': './client/hot-reload.js',
  },
  output: {
    path: resolve('/dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('client'),
    },
  },
  plugins: isProduction
    ? [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      }),
      new ExtractTextPlugin('assets/index.css'),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        sourceMap: true,
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true,
        },
      }),
      new HtmlWebpackPlugin({
        template: 'client/index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
        inject: true,
      }),
      new FriendlyErrorsPlugin(),
    ]
  : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'client/index.html',
      inject: true,
    }),
    new FriendlyErrorsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('client'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: isProduction
            ? ExtractTextPlugin.extract({
              use: ['vue-style-loader', 'css-loader'],
              fallback: 'vue-style-loader',
            })
          : [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                minimize: isProduction,
                sourceMap: isProduction,
              },
            },
          ],
          transformToRequire: {
            video: 'src',
            source: 'src',
            img: 'src',
            image: 'xlink:href',
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('client'), resolve('test')],
      },
      {
        test: /\.css$/,
        loader: isProduction
          ? ExtractTextPlugin.extract({
            fallback: 'vue-style-loader',
            use: ['css-loader'],
          })
        : [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: isProduction,
              sourceMap: isProduction,
            },
          },
        ],
        include: [resolve('node_modules')],
      },
    ],
  },
}
