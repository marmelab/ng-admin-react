var path = require('path');
var webpack = require('webpack');

function getEntrySources() {
    var sources = [];

    if (process.env.NODE_ENV !== 'production') { // for live reload
        sources.push('webpack-dev-server/client?http://0.0.0.0:8080');
        sources.push('webpack/hot/dev-server');
    }

    sources.push('./app/index.js');

    return sources;
}

function getPlugins() {
    var plugins = [new webpack.NoErrorsPlugin()];

    if (process.env.NODE_ENV === 'production') {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }));
    }

    return plugins;
}

module.exports = {
    entry: getEntrySources(),
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
                test: /\.scss|\.css$/,
                loader: "style!css!sass?" +
                    "includePaths[]=" + path.resolve(__dirname, "./node_modules/bootstrap-sass/assets/stylesheets/")
            },
            { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff2?$|\.ttf|\.eot$/, loader: "file" }
        ]
    },
    plugins: getPlugins(),
    node: {
        fs: "empty"
    }
};
