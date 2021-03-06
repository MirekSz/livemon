'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const Webpack = require('webpack');
const Path = require('path');

const dest = Path.join(__dirname, '../dist');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: dest,
        inline: true
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    plugins: [
        new Webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                include: Path.resolve(__dirname, '../src'),
                enforce: "pre",
                loader: 'eslint-loader',
                options: {
                    emitWarning: true,
                }
            },
            {
                test: /\.(js)$/,
                include: Path.resolve(__dirname, '../src'),
                loader: 'babel-loader'
            },
            {
                test: /\.s?css$/i,
                use: ['style-loader', 'css-loader?sourceMap=true', 'sass-loader']
            }
        ]
    }
});
