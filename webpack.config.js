const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MakeDirWebpackPlugin = require('make-dir-webpack-plugin');

const config = (env, argv) => {

  const backend_url = argv.mode === 'production'
    ? 'https://shrouded-atoll-37097.herokuapp.com/api/'
    : 'http://localhost:3001/api/'
  
    const static = argv.mode === 'production'
    ? 'https://shrouded-atoll-37097.herokuapp.com/uploads/'
    : 'http://localhost:3001/uploads/'

  return {
    entry: ['@babel/polyfill', './src/index.js'],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js',
      publicPath: '/'
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'build'),
      compress: true,
      historyApiFallback: true,
      port: 3000,
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          query: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          use: [{
            /* inline if smaller than 10 KB, otherwise load as a file */
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }]
        },
        { 
          test: /\.(eot|svg|ttf|woff2?|otf)$/,
          use: 'file-loader'
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url),
        STATIC: JSON.stringify(static)
      }),
      new MiniCssExtractPlugin({
          filename: `src/styles/main.css`
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html')
      }),
      new CopyWebpackPlugin([{
          from: path.resolve(__dirname, 'src/assets/img'),
          to: path.resolve(__dirname, 'build/assets/img')
      }, {
          from: path.resolve(__dirname, 'src/assets/styles'),
          to: path.resolve(__dirname, 'build/assets/styles')
      }
      ])
      // new MakeDirWebpackPlugin({
      //   dirs: [
      //     { path: path.resolve(__dirname, 'build/assets/uploads') }
      //   ]
      // })
    ]
  }
}

module.exports = config