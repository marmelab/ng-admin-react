module.exports = {
    entry: ['./app/sample.js'],
    output: {
        path: './build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'jsx-loader' }
        ]
    }
};
