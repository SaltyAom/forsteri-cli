#!/usr/bin/env node
const { join } = require("path"),
    { readFileSync, existsSync } = require("fs"),
    copy = require("ncp"),
    rimraf = require("rimraf")

const colors = require("colors"),
    ora = require("ora")

const webpack = require("webpack")
const webpackDevServer = require("webpack-dev-server")

const execAt = process.cwd()

const removePreviousBuilt = (built = "/dist") => {
    if(existsSync(join(execAt, built)))
        rimraf.sync(join(execAt, built))
}

const checkRequirement = (callback) => {
    if(!existsSync(join(execAt + "/src/index.tsx"))) {
        console.log("")
        console.log(
            "  Couldn't find initial file. Make sure your project contains:",
            "src/index.tsx".cyan
        )
        console.log("")

        return
    }

    if(!existsSync(join(execAt + "/public/index.html"))) {
        console.log("")
        console.log(
            "  Couldn't index.html. Make sure your project contains:",
            "public/index.html".cyan
        )
        console.log("")

        return
    }

    callback()
}

const runDevServer = () => {
    let config = require("../webpack.js"),
        clientConfig = {}

    if (existsSync(join(execAt + "/forsteri.config.js")))
        clientConfig = readFileSync(join(execAt + "/forsteri.config.js"), {
            encoding: "utf-8"
        })

    config = {
        ...config,
        context: join(execAt, "."),
        entry: [join(execAt, "/src/index.tsx")],
        output: {
            ...config.output,
            path: join(execAt, "/dist")
        },
        devServer: {
            ...config.devServer,
            contentBase: join(execAt + "/public")
        },
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.tsx?$/,
                    use: ["ts-loader"],
                    include: join(execAt, "/src"),
                    exclude: /node_modules/
                }
            ]
        },
        ...clientConfig
    }

    const options = config.devServer

    webpackDevServer.addDevServerEntrypoints(config, options)
    const compiler = webpack(config)
    const server = new webpackDevServer(compiler, options)

    server.listen(3000, "localhost", () => {
        console.log("")
        console.log(
            "  Development Server running at",
            "http://localhost:3000".cyan
        )
        console.log("")
    })
}

const productionBuild = () => new Promise((resolve, reject) => {
    let config = require("../webpack.prod.js"),
    clientConfig = {}

    if (existsSync(join(execAt + "/forsteri.config.js")))
        clientConfig = readFileSync(join(execAt + "/forsteri.config.js"), {
            encoding: "utf-8"
        })

    config = {
        ...config,
        context: join(execAt, "."),
        entry: [join(execAt, "/src/index.tsx")],
        output: {
            ...config.output,
            path: join(execAt, "/dist")
        },
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.tsx?$/,
                    use: ["ts-loader"],
                    include: join(execAt, "/src"),
                    exclude: /node_modules/
                }
            ]
        },
        ...clientConfig
    }

    removePreviousBuilt()
    copy(join(execAt, "public"), join(execAt, "dist"))

    webpack(config)
        .run((err, stat) => {
            resolve(true)
        })
})

const buildComponents = () => new Promise((resolve, reject) => {
    let config = require("../webpack.component.js"),
    clientConfig = {}

    if (existsSync(join(execAt + "/forsteri.config.js")))
        clientConfig = readFileSync(join(execAt + "/forsteri.config.js"), {
            encoding: "utf-8"
        })

    config = {
        ...config,
        context: join(execAt, "."),
        entry: [join(execAt, "/src/index.tsx")],
        output: {
            ...config.output,
            path: join(execAt, "/components")
        },
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.tsx?$/,
                    use: ["ts-loader"],
                    include: join(execAt, "/src"),
                    exclude: /node_modules/
                }
            ]
        },
        ...clientConfig
    }

    removePreviousBuilt('components')

    webpack(config)
        .run((err, stat) => {
            resolve(true)
        })
})

// Main
;(async () => {
    let [_, __, command] = process.argv

    switch (command) {
        case "dev":
            checkRequirement(runDevServer)
            break

        case "build":
            checkRequirement(async () => {
                let spinner = ora("Generating Production Build").start()

                await productionBuild()

                spinner.stop()
            })
            break
        
        case "components":
            checkRequirement(async () => {
                let spinner = ora("Generating Components").start()

                await buildComponents()

                spinner.stop()
            })
            break    

        case "help":
            console.log("Usage: forsteri-cli <command>")
            console.log("")

            console.log("Command List:")
            console.log("")

            console.log("  dev".cyan)
            console.log("  Start development server for Forsteri app with HMR")
            console.log("")

            console.log("  build".cyan)
            console.log("  Bundle project for production")
            console.log("")

            console.log("  components".cyan)
            console.log("  Generate as seperated web components which can be used anywhere")
            console.log("")

            console.log("  help".cyan)
            console.log("  Show command list")
            console.log("")
            break

        default:
            console.log(
                "Unknown command. To view available command use",
                "forsteri-cli help".cyan
            )
    }
})()
