var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:8080',
        'webpack/hot/dev-server',
        "./app/app.js"
    ],
    output: {
        path: __dirname + '/build',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
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
