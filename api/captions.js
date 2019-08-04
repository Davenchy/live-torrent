const app = require("express")();
const OS = require("opensubtitles-api");

const { OSUA, OSUN, OSPS } = process.env;
const osapi = new OS({
  username: OSUN,
  password: OSPS,
  useragent: OSUA
});
osapi.login().catch(err => console.error(err));

app.get("/:imdbid", (req, res) => {
  const { imdbid } = req.params;
  osapi
    .search({ imdbid: imdbid.replace("tt", ""), limit: "best" })
    .then(s => {
      const langs = [];
      const keys = Object.keys(s);
      keys.forEach(key => {
        const lang = s[key];
        langs.push(lang);
      });
      res.status(200);
      res.send(langs);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
});

module.exports = app;
