const { join } = require("path"),
    webpack = require("webpack"),
    TerserPlugin = require("terser-webpack-plugin")

module.exports = {
    mode: "production",
    context: join(__dirname, "src"),
    entry: ["./index.tsx"],
    plugins: [new webpack.HashedModuleIdsPlugin()],
    output: {
        path: join(__dirname, "component"),
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
        minimizer: [new TerserPlugin()],
        splitChunks: {
            chunks: "all",
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    reuseExistingChunk: true
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        // get the name. E.g. node_modules/packageName/not/this/part.js
                        // or node_modules/packageName
                        const packageName = module.context.match(
                            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                        )[1]

                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `${packageName.replace("@", "")}`
                    }
                },
                component: {
                    test: /\/(.*?).tsx$/,
                    name(module) {
                        const componentName = module.request.split("/")[module.request.split("/").length - 1]

                        return `${componentName.replace(".tsx", "")}`
                    }
                }
            }
        }
    }
}
