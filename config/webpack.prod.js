var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const path = require('path');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig,{
    devtool: false,

    output: {
        path: helpers.root('dist'),
        publicPath: './',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    plugins: [

        // Delete unused CSS styles
        /*
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(helpers.root('src', '**', '*.html')),
        
        }),
        */
        
        
        // for production
        new webpack.DefinePlugin({ 'process.env': {'ENV': JSON.stringify(ENV)} }),
        
         // Delete unused JS code
         new UglifyJsPlugin({
            "test": /\.js$/i,
            "extractComments": false,
            "sourceMap": false,
            "cache": false,
            "parallel": false,
            "uglifyOptions": {
              "output": {
                "ascii_only": true,
                "comments": false,
                "webkit": true
              },
              "ecma": 5,
              "warnings": false,
              "ie8": false,
              "mangle": {
                "safari10": true
              },
              "compress": {
                "typeofs": false,
                "pure_getters": true,
                "passes": 3
              }
            }
          }),
    ],
    node: {
        fs: "empty",
        global: true,
        crypto: "empty",
        tls: "empty",
        net: "empty",
        process: true,
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
});