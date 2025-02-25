import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import DotEnv from "dotenv-webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    mode: "development",
    entry: "/client_src/main.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: "/node_modules/",
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpeg|jpg|svg|webp)$/i,
                type: "asset/resource",
            },
            {
                test: /\.json$/i,
                type: "module",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.html"),
            favicon: path.join(__dirname, "/client_src/assets/favicon.ico"),
        }),
        new DotEnv(),
    ],
    devServer: {
        compress: true,
        historyApiFallback: {
            rewrites: [
                {
                    from: /./,
                    to: "/index.html",
                },
            ],
        },
        port: 7924,
    },
    devtool: "inline-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".jsx", ".js"],
        alias: {
            "@components": path.resolve(__dirname, "client_src/components"),
            "@styles": path.resolve(__dirname, "client_src/styles"),
            "@assets": path.resolve(__dirname, "client_src/assets"),
            "@root": path.resolve(__dirname),
            "@src": path.resolve(__dirname, "client_src"),
        },
    },
    output: {
        filename: "main.bundle.js",
        path: path.resolve(__dirname, "client_dist"),
        publicPath: "/",
    },
};

export default config;
