const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const liveTorrentBackend = require("live-torrent-backend");

// setup env vars
require("dotenv").config();

const app = express();
// setup middle wares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// logs
app.use(morgan("dev"));

// server cors policy for backend api
app.use("/api", cors(), liveTorrentBackend(true));
app.use("/api/yts", cors(), require("./yts-api.js"));

// for production
if (process.env.NODE_ENV === "production") {
  // handle static content
  app.use(express.static("./dist"));

  // handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/dist/index.html"));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
