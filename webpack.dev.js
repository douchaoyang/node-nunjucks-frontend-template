const path = require("path");
const { merge } = require("webpack-merge");
const { VueLoaderPlugin } = require("vue-loader");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const common = require("./webpack.common.js");

const publicPath = process.env.PUBLIC_PATH || "http://localhost:2233/";

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    const config = merge(common, {
      mode: "development",
      devtool: "inline-source-map",
      output: { publicPath },
      devServer: {
        host: "localhost",
        port: "2233",
        open: false,
        liveReload: false,
        client: {
          overlay: {
            warnings: false,
          },
        },
        static: {
          directory: path.join(__dirname, "resources"),
        },
        allowedHosts: ["localhost:3233"],
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      plugins: [
        new VueLoaderPlugin(),
        new WebpackAssetsManifest({
          output: "entrypoints.json",
          writeToDisk: true,
          entrypoints: true,
          entrypointsKey: false,
          publicPath: true,
          customize() {
            return false;
          },
          transform(assets) {
            let result = {};
            for (let key in assets) {
              result[key] = {
                js: assets[key].assets.js || [],
                css: assets[key].assets.css || [],
                dependencies: [],
              };
            }
            return result;
          },
        }),
      ],
    });
    resolve(config);
  });
};
