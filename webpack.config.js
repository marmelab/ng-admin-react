var webpack = require('webpack');

var config = {
    addVendor: function(name, path) {
        this.resolve.alias[name] = path;
        this.module.noParse.push(new RegExp('^' + name + '$'));
    },
    entry: {
        app: ['webpack/hot/dev-server', './app/sample.js'],
        vendors: ['react']
    },
    resolve: {
        alias: {
            // filled with addVendor method
        }
    },
    output: {
        path: './build',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
    ],
    module: {
        noParse: [], // filled with addVendor method
        loaders: [
            { test: /\.js$/, loader: 'jsx-loader' }
        ]
    }
};

config.addVendor('react', __dirname + '/bower_components/react/react.min.js');

module.exports = config;
