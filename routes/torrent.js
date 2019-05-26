const router = require('express').Router();
const torrents = require('../helpers/torrents');

// stream torrent file by index
router.get('/stream', (req, res) => {
  const { torrentId, fileIndex } = req.query;
  torrents.add(torrentId, (err, torrent) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    } else {
      const len = torrent.files.length;
      if (fileIndex < 0 || fileIndex >= len) res.sendStatus(400);
      else torrents.serveFile(torrent.files[fileIndex], req, res);
    }
  });
});

// add torrent file to the webtorrent client
// router.post('/', (req, res) => {
//   const torrentId = req.body.torrent;
//   torrents.add(torrentId, (err, torrent) => {
//     if (err) {
//       console.error(err);
//       res.sendStatus(500);
//     }
//     else res.send(torrent.jsonify());
//   });
// });



module.exports = router;
