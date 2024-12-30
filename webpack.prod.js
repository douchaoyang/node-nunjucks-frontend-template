const path = require("path");
const { merge } = require("webpack-merge");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const WebpackAssetsManifest = require("webpack-assets-manifest");
const common = require("./webpack.common.js");

const publicPath = process.env.PUBLIC_PATH || "/app/themes/eefocus/dist/";

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    const config = merge(common, {
      mode: "production",
      output: {
        publicPath: publicPath,
        filename: "js/[name].[contenthash:8].js",
        chunkFilename: "js/[name].[contenthash:8].js",
      },
      performance: {
        hints: "error", // false | "error" | "warning"
        maxEntrypointSize: 1024 * 1024 * 10, // bytes
        maxAssetSize: 1024 * 1024 * 10, // bytes
      },
      plugins: [
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, "resources", "libs"),
              to: path.join(__dirname, "dist", "libs"),
            },
            {
              from: path.join(__dirname, "resources", "fonts"),
              to: path.join(__dirname, "dist", "fonts"),
            },
            {
              from: path.join(__dirname, "resources", "images"),
              to: path.join(__dirname, "dist", "images"),
            },
          ],
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
          filename: "css/[name]-[contenthash:16].css",
          chunkFilename: "css/[name]-[contenthash:16].css",
        }),
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
        new WebpackManifestPlugin({
          publicPath: "",
        }),
      ],
    });

    resolve(config);
  });
};
