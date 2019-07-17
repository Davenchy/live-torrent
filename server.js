const express = require("express");
const bodyParser = require("body-parser");

// setup env vars
require("dotenv").config();

const app = express();

// setup view engine

// setup app static content
// TODO: active the next line later
// app.use(express.static("public"));

// setup middle wares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup routes
app.use("/api", require("./api"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is running on port " + PORT));
