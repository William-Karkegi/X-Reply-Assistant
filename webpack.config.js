const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/content.js",
  output: {
    filename: "content.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [new Dotenv()],
};
