const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: path.resolve(__dirname, 'public', 'js', 'app.js'),
    chat: path.resolve(__dirname, 'public', 'js', 'chat.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name]-bundle.js"
  },
  watch: true,
  devtool: 'source-map',
  module: {
    rules: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [ '@babel/preset-env' ]
        }
      }
    },
    {
      test: /\.(png|jpg|gif)$/i,
      exclude: /node_modules/,
      use: [ {
        loader: 'file-loader',
        options:
        {
          name: '[name]-bundle.[ext]',
        }
      } ]
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,

      use: [
        // Uncomment to generate bundle-css file
        //MiniCssExtractPlugin.loader,

        // Inject CSS into the DOM
        'style-loader',

        // Interprets @import and url() like import/require() and resolves them
        'css-loader',

        // Loads a Sass/SCSS file and compiles it to CSS
        'sass-loader',
      ]
    },
    {
      test: /\.html$/,
      exclude: /node_modules/,
      use: [ {
        loader: 'html-loader',
        options:
        {
          minimize: true,
        }
      } ]
    }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style-bundle.css',
    }),
    // By default exports sr/index.html
    new HtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'chat.html',
      template: path.resolve(__dirname, 'public', 'html', 'chat.html'),
    }),
    // By default cleans dist directory
    new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: [ '.js', '.scss', '.html' ]
  }
};