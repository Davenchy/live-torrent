const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

// setup env vars
require("dotenv").config();

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  path: "/api/sockets"
});

// setup middle wares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// setup socket.io
require("./remote")(io);

// server cors policy issue for backend api
app.use("/api", cors(), require("./api"));

// for production
if (process.env.NODE_ENV === "production") {
  // handle static content
  app.use(express.static("dist"));

  // handle SPA
  app.get(/.*/, (req, res) => res.send(__dirname + "/dist"));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
