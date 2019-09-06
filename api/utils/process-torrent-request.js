const app = require("express")();
const torrents = require("../lib/torrents");

// init
app.get("/", getTorrentId, loadTorrent, parseSelectors);
app.get("/:infoHash", getTorrentId, loadTorrent, parseSelectors);
app.get("/:infoHash/*", getTorrentId, loadTorrent, parseSelectors);

// handlers and help functions
const reqQueryToArray = q => (Array.isArray(q) ? q : [q]);

function getTorrentId(req, res, next) {
  const { infoHash } = req.params;
  const { torrentId } = req.query;
  let id;

  if (infoHash) {
    if (infoHash.length !== 40)
      return res.status(400).send("invalid torrent information hash");
    id = infoHash;
  } else if (torrentId) {
    const arr = reqQueryToArray(torrentId);
    if (arr.length > 0) id = arr[0];
  }

  if (!id) return res.status(400).send("torrent id is required");

  req.torrentId = id;
  next();
}

function loadTorrent(req, res, next) {
  torrents.request(req.torrentId, (err, torrent) => {
    if (err) {
      console.error(err);
      res.status(500).send(err.message || "");
    } else {
      req.torrent = torrent;
      next();
    }
  });
}

function parseSelectors(req, res, next) {
  const selectorQuery = req.params[0];
  const { fileIndex, filePath, fileType } = req.query;
  const torrentName = req.torrent.name;
  const torrentFiles = req.torrent.files;
  const selections = [];
  const files = [];

  const appendToArray = (a, b, prefix = "", postfix = "") =>
    a.forEach(i => {
      i = i.trim();
      if (i.length !== 0) b.push(prefix + i + postfix);
    });

  // add all inputs to one array
  if (selectorQuery) appendToArray(selectorQuery.split(","), selections);
  if (fileIndex) appendToArray(reqQueryToArray(fileIndex), selections);
  if (filePath) appendToArray(reqQueryToArray(filePath), selections);
  if (fileType) appendToArray(reqQueryToArray(fileType), selections, ":");

  // find the selected files
  selections.forEach(q => {
    const num = parseInt(q);
    const isNum = Number.isInteger(num) && `${num}` === q;

    if (isNum) {
      // query is index
      if (q >= 0 && q < torrentFiles.length) files.push(torrentFiles[q]);
    } else {
      // query is path
      for (let file of torrentFiles) {
        // is the query a type of file
        if (q.startsWith(":")) {
          const type = q.substr(1);
          if (
            (type.startsWith(".") && file.name.endsWith(type)) ||
            file.type.indexOf(type) != -1
          )
            files.push(file);
          continue;
        }

        // the query is just a normal path
        if (q.startsWith("/")) q = q.substr(1); // remove '/' from the path if exists
        if (file.path.substr(torrentName.length + 1) !== q) continue;
        files.push(file);
      }
    }
  });

  req.selectedFiles = files;
  req.custom = !!selections.length;
  next();
}

module.exports = app;
