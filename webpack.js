const { join } = require("path"),
    webpack = require("webpack")

module.exports = {
    mode: "development",
    context: join(__dirname, "src"),
    entry: ["./index.tsx"],
    output: {
        path: join(__dirname, "public"),
        filename: "main.js",
        publicPath: "public"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    stats: 'errors-only',
    devServer: {
        contentBase: join(__dirname, './public'),
        compress: false,
        port: 3000,
        hot: true,
        stats: 'errors-only',
        clientLogLevel: 'silent',
        bonjour: false,
        noInfo: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
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
    }
}
