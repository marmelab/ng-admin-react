function getEntrySources() {
    var sources = [];

    if (process.env.NODE_ENV !== 'production') { // for live reload
        sources.push('webpack-dev-server/client?http://0.0.0.0:8088');
        sources.push('webpack/hot/dev-server');
    }
    sources.push('./config-webpack.js'); // must be the last one

    return sources;
}

module.exports = {
    entry: {
        'app': getEntrySources()
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].js'
    },
    module: {
        loaders: [
            { test: /config-webpack\.js$/, loaders: ['react-hot', 'babel'] }
        ]
    },
    node: {
        fs: 'empty'
    }
};
