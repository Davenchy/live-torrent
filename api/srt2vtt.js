const http = require("http");
const srt2vtt = require("srt-to-vtt");
const Readable = require("stream").Readable;

const get = (req, res) => {
  const { path } = req.query;
  if (!path) return res.sendStatus(400);
  http.get(path, r => {
    if (r.statusCode !== 200) return res.sendStatus(404);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/vtt");
    r.pipe(srt2vtt()).pipe(res);
  });
};

const post = (req, res) => {
  const { srt } = req.body;
  if (!srt) return res.sendStatus(400);

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/vtt");

  const stream = new Readable();
  stream.push(srt);
  stream.push(null);
  stream.pipe(srt2vtt()).pipe(res);
};

module.exports = { get, post };
