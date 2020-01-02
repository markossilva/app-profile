const path = require("path");
const autoprefixer = require("autoprefixer");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appSrc = resolveApp("src");
const appIndexJs = resolveApp("src/index.js");
const appHtml = resolveApp("public/index.html");
module.exports = {
  entry: ["@babel/polyfill", paths.appIndexJs],
  output: {
    publicPath: "",
    filename: "[name].js",
    path: path.resolve(__dirname, "release")
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]"
            }
          },
          {
            test: /\.(js|jsx)$/,
            exclude: [path.resolve(__dirname, "node_modules")],
            loader: "babel-loader",
            query: {
              presets: ["@babel/preset-react"]
            }
          },
          {
            test: /\.css$/,
            use: [
              require.resolve("style-loader"),
              {
                loader: require.resolve("css-loader"),
                options: {
                  importLoaders: 1
                }
              },
              {
                loader: require.resolve("postcss-loader"),
                options: {
                  ident: "postcss",
                  plugins: () => [
                    require("postcss-flexbugs-fixes"),
                    autoprefixer({
                      browsers: [
                        ">1%",
                        "last 4 versions",
                        "Firefox ESR",
                        "not ie < 9"
                      ],
                      flexbox: "no-2009"
                    })
                  ]
                }
              }
            ]
          },
          {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.ejs$/],
            loader: require.resolve("file-loader"),
            options: {
              name: "static/media/[name].[hash:8].[ext]"
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: "empty"
  },
  resolve: {
    modules: [__dirname, "node_modules"]
  },
  plugins: [
    CopyWebpackPlugin([
      { from: path.resolve(__dirname, "../src/devIndex.js") }
    ]),
    new HtmlWebpackPlugin({
      template: paths.appHtml
    }),
    new CleanWebpackPlugin(["release"])
  ],
  devtool: "eval",
  externals: [],
  mode: "development"
};
