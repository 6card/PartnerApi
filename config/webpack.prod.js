var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const path = require('path');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig,{
    devtool: 'source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: './',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    plugins: [
    // Delete unused JS code
        new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
            mangle: {
                keep_fnames: true
            }
        }),

        // Delete unused CSS styles
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(helpers.root('src', '**', '*.html')),
        
        }),
        
        // for production
        new webpack.DefinePlugin({ 'process.env': {'ENV': JSON.stringify(ENV)} })
        

    ]
});