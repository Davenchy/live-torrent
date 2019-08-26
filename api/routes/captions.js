const app = require("express")();
const OS = require("opensubtitles-api");

const osapi = new OS(process.env.OSUA || "TemporaryUserAgent");
let isLoggedIn = false;

osapi
  .login()
  .then(() => (isLoggedIn = true))
  .catch(err => {
    console.log("opensubtitles.org login failed");
    // console.error(err);
  });

// is logged in middleware
app.use((req, res, next) => {
  if (!isLoggedIn) res.status(500).send("OpenSubtitles.org Login Failed!");
  else next();
});

app.get("/search", (req, res) => {
  const sublanguageid = req.query.lang || "all";
  const query = req.query.query;
  const limit = req.query.limit || "best";
  const season = req.query.season;
  const episode = req.query.episode;
  const imdbid = req.query.imdbid;

  osapi
    .search({ sublanguageid, query, limit, season, episode, imdbid })
    .then(data => res.send(data))
    .catch(err => {
      console.error(err);
      res.status(400).send(err.message || "try again later");
    });
});

module.exports = app;
