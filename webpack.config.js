const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
    entry: "./src/main.ts",
    output: {
        filename: "bundle.[contenthash].js", // Cache busting for production
        path: path.resolve(__dirname, "dist"),
        clean: true, // Clean the output folder before each build
    },
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "source-map", // Source maps only in development
    devServer: {
        static: "./dist", // Serve files from the dist directory
        port: 8080,
        open: true,
        hot: true, // Enable hot module replacement
    },
    resolve: {
        extensions: [".ts", ".js"], // Resolve these extensions
    },
    module: {
        rules: [
            {
                test: /\.ts$/, // Transpile TypeScript files
                use: "ts-loader",
                exclude: /node_modules/, // Exclude node_modules
            },
            {
                test: /\.css$/, // Handle CSS files
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
                type: "asset/resource", // Handle static assets
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html", // Template for the output HTML
            filename: "index.html", // Output HTML filename
        }),
    ],
    optimization: isProduction
        ? {
              minimize: true,
              minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
          }
        : {},
};
