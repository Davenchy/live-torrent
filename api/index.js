const app = require("express")();
const torrentAPI = require("./routes/torrent");
const torrentSearchEngine = require("./lib/torrent-search-engine");
const captions = require("./routes/captions");

app.use("/torrent", torrentAPI);
app.use("/search", torrentSearchEngine);
app.use("/captions", captions);

module.exports = app;
