const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  devServer: {
    proxy: {
      "/api": {
        target: "https://mirror.xyz",
        changeOrigin: true,
        wx: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
