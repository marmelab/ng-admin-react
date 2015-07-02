var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function getEntrySources() {
    var sources = [];

    if (process.env.NODE_ENV !== 'production') { // for live reload
        sources.push('webpack-dev-server/client?http://0.0.0.0:8080');
        sources.push('webpack/hot/dev-server');
    }

    // vendor css sources
    sources.push('pace/themes/blue/pace-theme-flash.css');
    sources.push('humane-js/themes/flatty.css');
    sources.push('react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css');
    sources.push('medium-editor/dist/css/medium-editor.css');
    sources.push('medium-editor/dist/css/themes/bootstrap.css');
    sources.push('codemirror/lib/codemirror.css');
    sources.push('codemirror/addon/lint/lint.css');

    // vendor js sources
    sources.push('codemirror/addon/edit/closebrackets');
    sources.push('codemirror/addon/edit/matchbrackets');
    sources.push('codemirror/addon/lint/lint');
    sources.push('codemirror/addon/lint/json-lint');
    sources.push('codemirror/addon/selection/active-line');
    sources.push('codemirror/mode/javascript/javascript');

    // react-admin sources
    sources.push('./styles/react-select-bootstrap.css');
    sources.push('./styles/app.scss');
    sources.push('./app/ReactAdmin.js'); // must be the last one

    return sources;
}

function getPlugins() {
    var plugins = [
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('[name].min.css', {
            allChunks: true
        })
    ];

    if (process.env.NODE_ENV === 'production') {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            mangle: false
        }));
    }

    return plugins;
}

module.exports = {
    entry: {
        'react-admin-standalone': getEntrySources(true)
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].min.js',
        library: 'ReactAdmin',
        libraryTarget: 'umd'
    },
    externals: {
        "react": {
            root: "React",
            commonjs2: "react",
            commonjs: "react",
            amd: "react"
        },
        "react-router": {
            root: "ReactRouter",
            commonjs2: "react-router",
            commonjs: "react-router",
            amd: "react-router"
        }
    },
    module: {
        loaders: [
            { test: /\.js$/, loaders: ['react-hot', 'babel?stage=1&optional[]=runtime'], exclude: /node_modules/ },
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css') },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') },
            { test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff2?$|\.ttf|\.eot$/, loader: 'url' }
        ]
    },
    plugins: getPlugins(),
    node: {
        fs: 'empty'
    }
};
