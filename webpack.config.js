const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: './public/js/app.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    watch: true,
    devtool: 'source-map',
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif)$/i,
                exclude: /node_modules/,
                use: 'file-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                            loader: 'css-loader',

                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: (loader) => [
                                    new require('autoprefixer')(),
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
    ]
};