const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// setup env vars
require("dotenv").config();

const app = express();

// server cors policy issue
app.use(cors());

// setup app static content
app.use(express.static("dist"));

// setup middle wares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// setup routes
app.use("/api", require("./api"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("server is running on port " + PORT));
