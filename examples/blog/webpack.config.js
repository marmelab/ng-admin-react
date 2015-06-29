
module.exports = {
    entry: {
        'app': [
            'webpack-dev-server/client?http://0.0.0.0:8088',
            'webpack/hot/dev-server',
            './config-webpack.js'
        ]
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].min.js'
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
