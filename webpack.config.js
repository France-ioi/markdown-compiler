const path = require('path');

module.exports = {
    mode: 'development',
    entry: './mdcompiler.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'markdown-bundle.js',
        library: "mdcompiler",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    performance: {
        hints: false,
        maxEntrypointSize: 2048000,
        maxAssetSize: 2048000
    },
    watchOptions: {
        ignored: /node_modules/
    }
};