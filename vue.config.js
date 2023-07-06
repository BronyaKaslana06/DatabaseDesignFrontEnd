const fs = require('fs')
const path = require('path')
const { defineConfig } = require('@vue/cli-service')

const baseFolder =

    process.env.APPDATA !== undefined && process.env.APPDATA !== ''
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : "vueapp";

if (!certificateName) {
    console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
    process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

module.exports = defineConfig({
    devServer: {
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        },
        proxy: {
            '^/weatherforecast': {
                target: 'https://localhost:7240/'
            }
        },
        port: 5002
    },
    configureWebpack: {
        resolve: { extensions: [".ts", ".tsx", ".js", ".json"] },
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              exclude: /node_modules/,
              options: {
                appendTsSuffixTo: [/\.vue$/],
              }
            }
          ]
        }
    },
    transpileDependencies: true,
    lintOnSave: false,
    publicPath: "./"
});
