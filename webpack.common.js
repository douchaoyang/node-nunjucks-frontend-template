const path = require("path");
const fs = require("fs");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { DefinePlugin } = require("webpack");
const publicPath = process.env.PUBLIC_PATH || "https://cdn.domain/";

class BuildTimeWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compile.tap("BuildTimeWebpackPlugin", (params) => {
      this.startTime = Date.now();
    });
    compiler.hooks.done.tap("BuildTimeWebpackPlugin", (stats) => {
      const endTime = Date.now();
      const duration = (endTime - this.startTime) / 1000;
      process.stdout.write(
        `\r\x1b[K\x1b[42m编译完成，用时 ${duration} 秒\x1b[0m\n`
      );
    });
  }
}

function getEntries(entryPath, entryObj) {
  const files = fs.readdirSync(entryPath);
  files.forEach(function (filePath) {
    const fullpath = `${entryPath}/${filePath}`;
    const info = fs.statSync(fullpath);
    if (info.isDirectory()) {
      getEntries(fullpath, entryObj);
    } else {
      if (fullpath && fullpath.indexOf(".DS_Store") >= 0) {
        return;
      }
      let key = fullpath.replace("./resources/js/", "");
      key = key.replace(".js", "");
      entryObj[key] = fullpath;
    }
  });
  return entryObj;
}

/**
 * {
 *     'entry/admin/app': './resources/js/entrys/admin/app.js'
 * }
 */
const entries = getEntries("./resources/js/entrys", {});

module.exports = {
  mode: "development",
  stats: "errors-only",
  entry: entries,
  output: {
    filename: "js/[name].js",
    chunkFilename: "js/[name].js",
    path: path.join(__dirname, "dist"),
    publicPath: publicPath,
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /\.js$/,
        exclude: {
          and: [/node_modules/],
          not: [/\.vue\.js/],
        },
        use: {
          loader: "babel-loader",
          options: {
            compact: true,
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.styl(us)?$/,
        use: [
          process.env.NODE_ENV !== "production"
            ? "vue-style-loader"
            : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              sourceMap: process.env.NODE_ENV !== "production",
              plugins: [require("autoprefixer")({ remove: false })],
            },
          },
          {
            loader: "stylus-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== "production"
            ? "vue-style-loader"
            : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production",
            },
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              sourceMap: process.env.NODE_ENV !== "production",
              plugins: [require("autoprefixer")({ remove: false })],
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name].[hash:16][ext]",
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name].[hash:16][ext]",
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: {
      name: "app",
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false,
        vendor: {
          name: "vendor",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          enforce: true,
          priority: 1,
        },
      },
    },
    minimizer: [
      process.env.NODE_ENV == "production" &&
        new TerserPlugin({
          parallel: true,
          extractComments: false,
        }),
      process.env.NODE_ENV == "production" &&
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
    ],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./resources"),
      "@": path.resolve(__dirname, "./resources"),
    },
    extensions: [".js", ".vue", ".css", ".styl"],
  },
  externals: {
    jquery: "jQuery",
  },
  plugins: [
    new BuildTimeWebpackPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: "true",
      __VUE_PROD_DEVTOOLS__: "false",
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
    }),
  ],
};
