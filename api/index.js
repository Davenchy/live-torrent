const router = require("express").Router();
const playlistBuilder = require("./playlist-builder");
const torrents = require("./torrents");
const srt2vtt = require("./srt2vtt");
const torrentSearchEngine = require("./torrent-search-engine");
const captions = require("./captions");
const yazl = require("yazl");
const pump = require("pump");

const reqParser = (req, res, next) => {
  req.torrentId = req.params.infoHash || req.query.torrentId;
  req.fileIndex = req.params.fileIndex || req.query.fileIndex || 0;
  next();
};

// stream torrent file by index
const stream = (req, res) => {
  const { torrentId, fileIndex } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) {
      console.error(err);
      console.log(torrentId);
      res.sendStatus(500);
    } else {
      const len = torrent.files.length;
      const { servePath } = req;
      let file;

      if (fileIndex < 0 || fileIndex >= len) return res.sendStatus(400);
      if (servePath)
        file = torrent.files.find(f => f.path === torrent.name + servePath);
      else file = torrent.files[fileIndex];

      if (!file) return res.sendStatus(404);

      torrents.serveFile(file, req, res);
    }
  });
};

router.get("/stream", reqParser, stream);
router.get("/stream/serve/:infoHash", reqParser, (req, res) => {
  res.redirect("/api/info/" + req.torrentId);
});
router.get(
  "/stream/serve/:infoHash/*",
  reqParser,
  (req, res, next) => {
    const path = "/" + req.params["0"];
    if (path.length > 1) req.servePath = path;
    next();
  },
  stream
);
router.get("/stream/:infoHash/:fileIndex", reqParser, stream);

// download zip file
const downloadReqParser = (req, res, next) => {
  const { torrentId } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else {
      req.torrent = torrent;
      next();
    }
  });
};

const downloadZIP = (req, res) => {
  const { torrent } = req;
  const zipFile = new yazl.ZipFile();

  res.attachment(torrent.name + ".zip");
  res.setHeader("Content-Length", torrent.length);
  req.connection.setTimeout(3600000);

  pump(zipFile.outputStream, res);

  torrent.files.forEach(f =>
    zipFile.addReadStream(f.createReadStream(), f.path)
  );
  zipFile.end();
};

router.get("/download", reqParser, downloadReqParser, downloadZIP);
router.get("/download/:infoHash", reqParser, downloadReqParser, downloadZIP);

// add torrent file to the webtorrent client
// torrent info
const torrentInfo = (req, res) => {
  const { torrentId } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else res.send(torrent.toJson());
  });
};

router.get("/info", reqParser, torrentInfo);
router.get("/info/:infoHash", reqParser, torrentInfo);

// build playlist
const playlist = (req, res, next) => {
  const { torrentId } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else {
      req.torrent = torrent.toJson();
      next();
    }
  });
};

router.get("/playlist", reqParser, playlist, playlistBuilder);
router.get("/playlist/:infoHash", reqParser, playlist, playlistBuilder);

// download torrent file
const torrentFile = (req, res) => {
  const { torrentId } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else {
      const tor = torrent.torrentFile;

      res.attachment(torrent.name + ".torrent");
      res.setHeader("Content-Length", tor.length);
      res.setHeader("Content-Type", "application/x-bittorrent");
      req.connection.setTimeout(30000);

      res.send(tor);
    }
  });
};

router.get("/torrentfile", reqParser, torrentFile);
router.get("/torrentfile/:infoHash", reqParser, torrentFile);

// srt to vtt converter
router.use("/srt2vtt", srt2vtt);

// torrent search engine
router.use("/search", torrentSearchEngine);

// movies captions
router.use("/captions", captions);

module.exports = router;
