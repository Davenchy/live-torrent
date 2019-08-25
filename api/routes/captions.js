const app = require("express")();
const OS = require("opensubtitles-api");

const { OSUA, OSUN, OSPS } = process.env;
const osapi = new OS({
  username: OSUN || "",
  password: OSPS || "",
  useragent: OSUA || ""
});
let isLoggedIn = false;

osapi
  .login()
  .then(() => (isLoggedIn = true))
  .catch(err => {
    console.log("opensubtitles.org login failed");
    console.error(err);
  });

// is logged in middleware
app.use((req, res, next) => {
  if (!isLoggedIn) res.status(500).send("OpenSubtitles.org Login Failed!");
  else next();
});

// app.get("/search/:query", (req, res))

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
      res.status(500).send(err.message || "");
    });
});

module.exports = app;
