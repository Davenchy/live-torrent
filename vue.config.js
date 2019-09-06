// setup env vars
require("dotenv").config();

const PORT = process.env.PORT || 3000;

module.exports = {
  configureWebpack: {
    devtool: "source-map"
  },
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:" + PORT
      }
    }
  }
};
