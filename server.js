const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const history = require("connect-history-api-fallback");

// setup env vars
require("dotenv").config();

const app = express();

// setup middle wares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("combined"));

// history mode for vue.js
app.use(
  history({
    rewrites: [
      {
        from: /\/api(\/.+)?/,
        to(context) {
          return context.parsedUrl.path;
        }
      }
    ]
  })
);

// setup app static content
app.use(express.static("dist"));

// server cors policy issue for backend api
app.use("/api", cors(), require("./api"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is running on port " + PORT));
