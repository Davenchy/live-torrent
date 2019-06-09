const router = require('express').Router();
const torrents = require('../helpers/torrents');

router.get('/', (req, res) => res.render('home'));

const reqParser = (req, res, next) => {
  req.torrentId = req.params.infoHash || req.query.torrentId;
  req.fileIndex = req.params.fileIndex || req.query.fileIndex || 0;
  next();
};

// explorer page
const explorer = (req, res) => {
  const { torrentId } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) {
      console.error(err);
      res.render('error', { code: 500, message: 'Can not parse the torrentId' });
    } else {
      res.render('explorer', {
        host: (req.secure ? "https://" : "http://") + req.headers.host,
        torrent: torrent.jsonify()
      });
    }
  });
};

router.get('/explorer', reqParser, explorer);
router.get('/explorer/:infoHash', reqParser, explorer);

// player page
const player = (req, res) => {
  const { torrentId, fileIndex } = req;
  torrents.add(torrentId, (err, torrent) => {
    if (err) {
      console.error(err);
      res.render('error', { code: 500, message: 'Can not parse the torrentId' });
    } else {
      res.render('player', {
        host: (req.secure ? "https://" : "http://") + req.headers.host,
        torrent: torrent.jsonify(),
        fileIndex,
        file: torrent.files[fileIndex]
      });
    }
  });
};

router.get('/player', reqParser, player);
router.get('/player/:infoHash/:fileIndex', reqParser, player);

module.exports = router;
