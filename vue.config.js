// setup env vars
require("dotenv").config();

const PORT = process.env.PORT || 3000;

module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:" + PORT
      }
    }
  }
};
