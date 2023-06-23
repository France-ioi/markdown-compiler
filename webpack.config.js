const path = require('path');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

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
    plugins: [
        new MergeIntoSingleFilePlugin({
            files: {
                "markdown-task.js": [
                    './bebras-modules/ext/jschannel/jschannel.js',
                    './bebras-modules/integrationAPI.01/official/platform-pr.js',
                    './bebras-modules/pemFioi/static-task.js',
                    './bebras-modules/ext/jquery/1.7/jquery.min.js',
                    './bebras-modules/integrationAPI.01/installationAPI.01/pemFioi/installation.js',
                    './dist/markdown-css.js'
                ]
            }
        })
    ],
    watchOptions: {
        ignored: /node_modules/
    }
};