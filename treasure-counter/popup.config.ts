import HtmlWebpackPlugin from 'html-webpack-plugin'
import * as path from 'path'
import * as webpack from 'webpack'

const config: webpack.Configuration = {
    mode: 'development',
    entry: path.resolve(__dirname, 'popup', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'popup.bundle.js',

    },
    target: "electron-renderer",
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'popup', 'public', 'index.html'),
            favicon: path.resolve(__dirname, 'popup', 'public', 'favicon.ico'),
            scriptLoading: "blocking",
            inject: "body",
        }),

    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            }
        ],
    }, resolve: {
        extensions: ['.tsx', '.jsx', '.ts', '.js', '.wasm'],
    }
};

export default config;