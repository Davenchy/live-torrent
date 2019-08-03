const app = require("express")();
const tsapi = require("torrent-search-api");

tsapi.enablePublicProviders();
tsapi.disableProvider("Torrent9");
tsapi.disableProvider("TorrentProject");
tsapi.disableProvider("Torrentz2");

app.get("/providers", (req, res) => {
  res.send(
    tsapi
      .getActiveProviders()
      .map(p => ({ name: p.name, categories: p.categories }))
  );
});

app.get("/", async (req, res) => {
  const { category, provider, query, limit } = req.query;

  if (!query) return res.sendStatus(400);

  try {
    let results = [];

    if (!provider) {
      results = await tsapi.search(
        query || "",
        category || "All",
        limit || 100
      );
    } else {
      results = await tsapi.search(
        [provider],
        query || "",
        category || "All",
        limit || 100
      );
    }

    for (let i in results) {
      const magnet = await tsapi.getMagnet(results[i]);
      results[i].magnet = magnet;
      results[i].hash = magnet.match(/magnet:.+:.+:(.{40})/)[1];
    }

    res.send(results);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = app;
