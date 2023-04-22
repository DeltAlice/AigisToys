import WasmPackPlugin from '@wasm-tool/wasm-pack-plugin'
import * as path from 'path'
import * as webpack from 'webpack'

const config: webpack.Configuration = {
    mode: 'development',
    entry: path.resolve(__dirname, 'background', 'index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
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

export default config;