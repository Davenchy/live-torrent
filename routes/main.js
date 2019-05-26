const router = require('express').Router();

router.get('/', (req, res) => res.render('home'));
router.get('/explorer/:hash', (req, res) => {
  const { hash } = req.params;
  res.render('explorer', { hash });
});
router.get('/player/:hash/:index', (req, res) => {
  const { hash, index } = req.params;
  const { subtitle } = req.query;
  res.render('player', { hash, index, subtitle });
});

module.exports = router;
