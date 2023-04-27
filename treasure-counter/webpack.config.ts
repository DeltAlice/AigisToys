import WasmPackPlugin from '@wasm-tool/wasm-pack-plugin'
import * as path from 'path'
import * as webpack from 'webpack'
import CopyPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const backgrounConfig: webpack.Configuration = {
    mode: 'production',
    entry: path.resolve(__dirname, 'background', 'index.ts'),
    output: {
        path: path.resolve(__dirname, '..', 'dist', 'treasure-counter'),
        filename: 'background.bundle.js',
        library: "treasure",
        libraryTarget: "umd"
    },
    target: "electron-main",
    plugins: [
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, '..', 'aigis-crab', 'treasure-counter'),
            outDir: path.resolve(__dirname, 'background', 'wasm'),
            outName: 'crab'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "./plugin.manifest.json",
                    to: "./manifest.json",
                    transform(content, path) {
                        let packageInfo = require('./package.json');
                        let tempalte = JSON.parse(content.toString());
                        tempalte.version = packageInfo.version;
                        let manifest = JSON.stringify(tempalte, null, 2);
                        return manifest;
                    }
                }]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.tsx', '.jsx', '.ts', '.wasm'],
    },
    experiments: {
        asyncWebAssembly: true
    }
};


const popupConfig: webpack.Configuration = {
    mode: 'development',
    entry: path.resolve(__dirname, 'popup', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, '..', 'dist', 'treasure-counter'),
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

export default [backgrounConfig, popupConfig];