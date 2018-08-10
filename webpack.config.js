const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

const outputDir = "dist";

let apiHost = null;
switch (process.env.NODE_ENV) {
    case 'development':
        apiHost = 'http://localhost:3000';
        break;
    case 'production':
        apiHost = 'http://localhost';
        break;
}

const serverConfig = {
    target: 'node',
    node: {
        __dirname: true
    },
    entry: {
        server: './server/server.js'
    },
    output: {
        path: path.resolve(__dirname, outputDir),
        filename: "[name].bundle.js"
    },
    externals: [nodeExternals()]
};

const clientConfig = {
    target: "web",
    entry: {
        client: ['babel-polyfill', "./client/index.js"]
    },
    output: {
        path: path.resolve(__dirname, outputDir +'/client/'),
        publicPath: '/',
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(svg|ico)$/,
                use: 'url-loader'
            }
        ]
    },devServer: {
        port: 3000,
        open: true,
        contentBase: './client/',
        historyApiFallback: true,
        proxy: {
            "/api": "http://localhost:8080"
        }
    },
    plugins: [
        new CleanWebpackPlugin([outputDir]),
        new HtmlWebpackPlugin({
            template: "./client/index.html",
            //favicon: "./client/assets/favicon.ico"
        }),
        new webpack.DefinePlugin({
            __API_HOST__: JSON.stringify(apiHost)
        })
    ]
};

const configs = [clientConfig];
if(process.env.NODE_ENV === 'production') {
    configs.push(serverConfig);
}
module.exports = configs;
