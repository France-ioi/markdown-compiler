const path = require('path');

module.exports = {
    mode: 'production',
    entry: './css.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'markdown-css.js',
    },
    module: {
        rules: [

            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ["postcss-minify", {}],
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)$/i,
                // More information here https://webpack.js.org/guides/asset-modules/
                type: "asset",
                generator: {
                    filename: 'fonts/[name][ext]',
                }
            },
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