
module.exports = {
    entry: {
        'app': [
            'webpack-dev-server/client?http://0.0.0.0:8080',
            'webpack/hot/dev-server',
            './config-wp.js'
        ]
    },
    output: {
        path: __dirname + '/build',
        filename: '[name].min.js',
        library: 'App'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loaders: ['react-hot', 'jsx', 'babel'], exclude: /node_modules/ }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    node: {
        fs: 'empty'
    }
};
