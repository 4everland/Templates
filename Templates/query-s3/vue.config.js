module.exports = {
  outputDir: "dist",
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
  productionSourceMap: false,
  devServer: {
    host: "0.0.0.0",
    port: 8083,
    open: true,
  },
};
