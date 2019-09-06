const app = require("express")();
const torrents = require("../lib/torrents");
const ZipFile = require("yazl").ZipFile;
const pump = require("pump");
const processReq = require("../utils/process-torrent-request");

// routes //
app.use("/info", processReq, info);
app.use("/serve", processReq, serve);
app.use("/download", processReq, download);
app.use("/playlist", processReq, playList);
app.use("/torrentfile", processReq, torrentFile);

// handlers //
function info(req, res) {
  if (!req.custom) return res.send(req.torrent.toJSON()); // return default result
  // else return custom result
  const customResult = req.selectedFiles.map(f => f.toJSON());
  if (customResult.length === 1) res.send(customResult[0]);
  else res.send(customResult);
}

function serve(req, res) {
  const { selectedFiles, custom } = req;
  if (!custom) res.status(400).send("please select file");
  else if (!selectedFiles.length) res.status(404).send("file not found");
  else torrents.serveFile(selectedFiles[0], req, res);
}

function download(req, res) {
  const { torrent, selectedFiles, custom } = req;
  // add all selected files with full path
  const fullPath = req.query.fullPath !== false;

  // add headers
  res.attachment(`${torrent.name}.zip`);
  // res.setHeader("Content-Length", torrent.length);
  req.connection.setTimeout(3600000);

  // create zip file, add files and send the zip file

  const zipFile = new ZipFile();
  pump(zipFile.outputStream, res);

  (custom ? selectedFiles : torrent.files).forEach(file => {
    zipFile.addReadStream(
      file.createReadStream(),
      fullPath ? file.path : file.name
    );
  });

  zipFile.end();
}

function playList(req, res) {
  const { torrent, selectedFiles, custom } = req;
  const host = (req.secure ? "https://" : "http://") + req.headers.host;

  // create playlist string
  let m3uStr = "#EXTM3U\n";

  (custom ? selectedFiles : torrent.files).forEach(file => {
    if (file.type.indexOf("video") === -1 && file.type.indexOf("audio") === -1)
      return;
    m3uStr += `#EXTINF:-1,${file.name}\n${host}/api/torrent/serve/${
      torrent.infoHash
    }${file.cleanPath}\n`;
  });

  res.setHeader(
    "Content-Disposition",
    `inline; filename*=UTF-8''${torrent.name}.m3u`
  );
  res.attachment(torrent.name + ".m3u");
  res.setHeader("Content-Length", m3uStr.length);
  res.setHeader("Content-Type", "application/mpegurl");
  req.connection.setTimeout(10000);

  res.send(m3uStr);
}

function torrentFile(req, res) {
  const { torrent } = req;
  const file = torrent.torrentFile;

  res.setHeader(
    "Content-Disposition",
    `inline; filename*=UTF-8''${torrent.name}.torrent`
  );
  res.attachment(torrent.name + ".torrent");
  res.setHeader("Content-Length", file.length);
  res.setHeader("Content-Type", "application/x-bittorrent");
  req.connection.setTimeout(30000);

  res.send(file);
}

module.exports = app;
