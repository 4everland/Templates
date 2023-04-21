const { defineConfig } = require("@vue/cli-service");
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  outputDir: "dist",
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
  transpileDependencies: true,
  devServer: {
    host: "localhost",
    port: 8080,
    open: true,
  },
  // configureWebpack: {
  //   plugins: [new NodePolyfillPlugin()],
  // },
});
