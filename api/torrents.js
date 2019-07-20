const WebTorrent = require("webtorrent");
const pump = require("pump");
const rangeParser = require("range-parser");
const mime = require("mime");
const client = new WebTorrent();

const toJSONInit = (torrent, cb) => {
  torrent.toJson = () => ({
    name: torrent.name,
    infoHash: torrent.infoHash,
    size: torrent.length,
    peers: torrent.numPeers,
    files: [
      ...torrent.files.map((f, i) => ({
        name: f.name,
        index: i,
        path: f.path,
        size: f.length,
        type: mime.getType(f.name) || "",
        downloaded: f.downloaded
      }))
    ]
  });
  cb(null, torrent);
};

function add(torrentId, cb) {
  const torrent = client.add(torrentId);
  torrent.on("error", e => {
    if (e.message.indexOf("Cannot add duplicate torrent") !== -1) {
      toJSONInit(client.get(torrent.infoHash), cb);
    } else cb(e);
  });
  torrent.on("ready", () => toJSONInit(torrent, cb));
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
  add,
  serveFile
};
