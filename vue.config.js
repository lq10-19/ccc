module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  configureWebpack: {
    externals: {
      BMap: "BMap"
    }
  }
};
