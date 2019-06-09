const router = require('express').Router();
const torrents = require('../helpers/torrents');
const archiver = require('archiver');
const pump = require('pump');

// stream torrent file by index
router.get('/stream', (req, res) => {
  const { torrentId, fileIndex } = req.query;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else {
      const len = torrent.files.length;
      if (fileIndex < 0 || fileIndex >= len) res.sendStatus(400);
      else torrents.serveFile(torrent.files[fileIndex], req, res);
    }
  });
});

// add torrent file to the webtorrent client
router.get('/', (req, res) => {
  const { torrentId } = req.query;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else res.send(torrent.jsonify());
  });
});

// download zip file
router.get('/download', (req, res, next) => {
  const { torrentId } = req.query;
  torrents.add(torrentId, (err, torrent) => {
    if (err) res.sendStatus(500);
    else {
      req.torrent = torrent;
      next();
    }
  });
}, (req, res) => {
  const { torrent } = req;
  
  res.attachment(torrent.name + '.zip');
  res.setHeader('Content-Length', torrent.length);
  req.connection.setTimeout(3600000);

  var archive = archiver('zip');
  archive.on('warning', m => console.warn(m));
  archive.on('error', e => {
    console.error(e);
    res.sendStatus(500);
    res.end();
  });

  pump(archive, res);

  torrent.files.forEach(f => archive.append(f.createReadStream(), { name: f.path }));
  archive.finalize();
});



module.exports = router;
