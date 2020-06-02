const { join } = require("path"),
    webpack = require("webpack"),
    TerserPlugin = require("terser-webpack-plugin")

module.exports = {
    mode: "production",
    context: join(__dirname, "src"),
    entry: ["./index.tsx"],
    plugins: [new webpack.HashedModuleIdsPlugin()],
    output: {
        path: join(__dirname, "public"),
        filename: "[name].js",
        chunkFilename: "[name].js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.tsx?$/,
                use: ["ts-loader"],
                include: join(__dirname, "src"),
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()]
    }
}
