var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:8080',
        'webpack/hot/dev-server',
        "./app/ReactAdmin.js"
    ],
    output: {
        path: __dirname + '/build',
        filename: "react-admin-standalone.min.js",
        library: "ReactAdmin"
    },
    externals: {
        "react": "React"
    },
    module: {
        loaders: [
            { test: /\.js?$/, loaders: ['react-hot', 'babel?stage=1&optional[]=runtime'], exclude: /node_modules/ },
            { test: /\.js$/, loader: 'babel?stage=1&optional[]=runtime', exclude: /node_modules\/(?!admin-config)/ },
            { test: /react-router\/.*\.js$/, loader: 'babel'},
            {
                test: /\.scss$/,
                loader: "style!css!sass?" +
                    "includePaths[]=" + path.resolve(__dirname, "./node_modules/bootstrap-sass/assets/stylesheets/")
            },
            { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff2?$|\.ttf|\.eot$/, loader: "file" }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ]
};
