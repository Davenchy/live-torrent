const router = require('express').Router();
const playlistBuilder = require('../helpers/playlist-builder');
const torrents = require('../helpers/torrents');
const yazl = require('yazl');
const pump = require('pump');

const reqParser = (req, res, next) => {
  req.torrentId = req.params.infoHash || req.query.torrentId;
  req.fileIndex = req.params.fileIndex || req.query.fileIndex || 0;
  next();
};

// stream torrent file by index
const stream = (req, res) => {
  const { torrentId, fileIndex } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else {
      const len = torrent.files.length;
      if (fileIndex < 0 || fileIndex >= len) res.sendStatus(400);
      else torrents.serveFile(torrent.files[fileIndex], req, res);
    }
  });
};

router.get('/stream', reqParser, stream);
router.get('/stream/:infoHash/:fileIndex', reqParser, stream);


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
  
  res.attachment(torrent.name + '.zip');
  res.setHeader('Content-Length', torrent.length);
  req.connection.setTimeout(3600000);
  
  pump(zipFile.outputStream, res);
  
  torrent.files.forEach(f => zipFile.addReadStream(f.createReadStream(), f.path));
  zipFile.end();
};

router.get('/download', reqParser, downloadReqParser, downloadZIP);
router.get('/download/:infoHash', reqParser, downloadReqParser, downloadZIP);

// add torrent file to the webtorrent client
const torrentInfo = (req, res) => {
  const { torrentId } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else res.send(torrent.jsonify());
  });
};

router.get('/info', reqParser, torrentInfo);
router.get('/info/:infoHash', reqParser, torrentInfo);

// build playlist
const playlist = (req, res, next) => {
  const { torrentId } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else {
      req.torrent = torrent.jsonify();
      next();
    }
  });
};

router.get('/playlist', reqParser, playlist, playlistBuilder);
router.get('/playlist/:infoHash', reqParser, playlist, playlistBuilder);

// download torrent file
const torrentFile = (req, res) => {
  const { torrentId } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else {
      const tor = torrent.torrentFile;
      
      res.attachment(torrent.name + '.torrent');
      res.setHeader('Content-Length', tor.length);
      res.setHeader('Content-Type', 'application/x-bittorrent');
      req.connection.setTimeout(30000);

      
      res.send(tor);
    }
  });
};

router.get('/torrentfile', reqParser, torrentFile);
router.get('/torrentfile/:infoHash', reqParser, torrentFile);

module.exports = router;
