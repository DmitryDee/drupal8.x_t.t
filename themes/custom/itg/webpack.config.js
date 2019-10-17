const webpack = require('webpack');

//globals
const path = require('path');

//plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (env, argv) => {
  console.log(`Mode is: ${argv.mode}`);
  const devMode = argv.mode!=='production'; 
  return {
    context: path.resolve(__dirname, 'src'),
    entry: './app.js',
    output: {
      path: path.resolve(__dirname),
      filename: devMode ? './js/[name].js' : './js/[name].min.js',
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
      open: true,
    },
    devtool: devMode ? 'source-map' : '',
    module: {
      rules: [
        {
          test: /\.(sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        /*
          * Работает только во время обработки html.
          * Могу использовать для блоков footer/header например 
          * TODO: Посмотреть опции в мануале https://github.com/webpack-contrib/html-loader
        */  
        {
          test: /\.html$/,
          use: {
            loader: 'html-loader',
            options: {
              removeComments: true,
            }
          }
        },
        /*
        {
          test: /\.(jpg|png|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
              publicpath: 'img/',
            }
          }
        }
        */
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? './css/[name].css' : './css/[name].min.css',
      }),
      /*
        * TODO: Посмотреть опции в мануале https://github.com/NMFR/optimize-css-assets-webpack-plugin 
      */
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.min\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      }),

      /*
      new HtmlWebpackPlugin({
        template: './html/index.html.ejs',
        inject: false,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        },
        filename: 'index.html'
      }),
      */
      /* 
        * Ниже форматтер для html после генерации шаблона
        * TODO: Посмотреть опции в мануале https://github.com/beautify-web/js-beautify
      */
      /*
      new HtmlBeautifyPlugin({
        config: {
          html: {
            end_with_newline: true,
            indent_size: 2,
            indent_with_tabs: true,
            indent_inner_html: true,
            preserve_newlines: true,
            unformatted: ['p', 'i', 'b', 'span']
          }
        }
      })
      */
    ]
  }
};