const WebTorrent = require("webtorrent");
const pump = require("pump");
const rangeParser = require("range-parser");
const mime = require("mime");
const client = new WebTorrent();
const trackers = require("../utils/torrent-trackers");

const fileToJSON = (file, index) => ({
  name: file.name,
  index,
  path: file.cleanPath,
  size: file.length,
  type: file.type,
  downloaded: file.downloaded
});

const addOns = (torrent, cb) => {
  torrent.files.forEach((f, i) => {
    f.toJSON = () => fileToJSON(f, i, torrent.name);
    f.type = mime.getType(f.name) || "";
    f.cleanPath = f.path.substr(torrent.name.length);
  });
  torrent.toJSON = () => ({
    name: torrent.name,
    infoHash: torrent.infoHash,
    size: torrent.length,
    peers: torrent.numPeers,
    files: torrent.files.map(f => f.toJSON())
  });
  cb(null, torrent);
};

function request(torrentId, cb) {
  const torrent = client.add(torrentId, { announce: trackers });
  torrent.on("error", e => {
    if (e.message.indexOf("Cannot add duplicate torrent") !== -1) {
      addOns(client.get(torrent.infoHash), cb);
    } else cb(e);
  });
  torrent.on("ready", () => addOns(torrent, cb));
}

// serveFile from inside webtorrent createServer method
function serveFile(file, req, res) {
  if (!file) {
    res.statusCode = 404;
    return res.send();
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", mime.getType(file.name));

  // Support range-requests
  res.setHeader("Accept-Ranges", "bytes");

  // Set name of file (for "Save Page As..." dialog)
  res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${file.name}`);

  // Support DLNA streaming
  res.setHeader("transferMode.dlna.org", "Streaming");
  res.setHeader(
    "contentFeatures.dlna.org",
    "DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000"
  );

  // `rangeParser` returns an array of ranges, or an error code (number) if
  // there was an error parsing the range.
  let range = rangeParser(file.length, req.headers.range || "");

  if (Array.isArray(range)) {
    res.statusCode = 206; // indicates that range-request was understood

    // no support for multi-range request, just use the first range
    range = range[0];

    res.setHeader(
      "Content-Range",
      `bytes ${range.start}-${range.end}/${file.length}`
    );
    res.setHeader("Content-Length", range.end - range.start + 1);
  } else {
    range = null;
    res.setHeader("Content-Length", file.length);
  }

  if (req.method === "HEAD") {
    return res.end();
  }

  pump(file.createReadStream(range), res);
}

module.exports = {
  client,
  request,
  serveFile,
  fileToJSON
};
