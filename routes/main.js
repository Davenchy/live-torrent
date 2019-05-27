const router = require('express').Router();
const torrents = require('../helpers/torrents');

router.get('/', (req, res) => res.render('home'));

// explorer page
router.get('/explorer', (req, res) => {
  const { torrentId } = req.query;
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
});

// player page
router.get('/player', (req, res) => {
  const { torrentId, fileIndex, subtitle } = req.query;
  torrents.add(torrentId, (err, torrent) => {
    if (err) {
      console.error(err);
      res.render('error', { code: 500, message: 'Can not parse the torrentId' });
    } else {
      res.render('player', {
        host: (req.secure ? "https://" : "http://") + req.headers.host,
        torrent: torrent.jsonify(),
        fileIndex,
        subtitle
      });
    }
  });
});

module.exports = router;
