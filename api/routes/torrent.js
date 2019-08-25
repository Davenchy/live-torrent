const app = require("express")();
const torrents = require("../lib/torrents");
const ZipFile = require("yazl").ZipFile;
const pump = require("pump");

// middle wares //

// get torrent Id, file index and file path from the request
app.use(function(req, res, next) {
  req.torrentId = req.params.infoHash || req.query.torrentId;
  req.fileIndex = req.params.fileIndex || req.query.fileIndex || 0;
  req.filePath = req.query.filePath;
  if (!req.torrentId) return res.status(400).send("torrent ID is required");
  next();
});

// load torrent file
app.use(function(req, res, next) {
  torrents.request(req.torrentId, (err, torrent) => {
    if (err) {
      console.error(err);
      res.status(500).send(err.message || "");
    } else {
      req.torrent = torrent;
      next();
    }
  });
});

// parse file path
app.use(function(req, res, next) {
  req.filePath = "/" + req.params[0];
  next();
});

// parse selected files query
app.use(function(req, res, next) {
  const { select } = req.query;
  const selections = req.params[0];
  const files = [];

  if (!select && !selections) return next();

  const parseFilesQuery = obj => {
    // loop through all strings
    obj.forEach(str => {
      // split any string list into items
      str.split(",").forEach(item => {
        // check if the item is not a number
        const num = parseInt(item);
        const isNum = Number.isInteger(num);

        if (!isNum) {
          // item is a path
          item = item.trim();
          if (item.length)
            files.push({
              isPath: true,
              path: item
            });

          // item is an index
        } else files.push({ isPath: false, index: num });
      });
    });
  };

  const parseObject = obj => parseFilesQuery(Array.isArray(obj) ? obj : [obj]);

  // parse the select object if defined
  if (select) parseObject(select);
  // parse the selections object if defined
  if (selections) parseObject(selections);

  req.files = files;
  next();
});

// routes //

app.get("/info", info);
app.get("/serve", serve);
app.get("/download", download);
app.get("/playlist", playList);

// advanced routes //

app.get("/info/:infoHash", info);
app.get("/serve/:infoHash", serve);
app.get("/serve/:infoHash/*", serve);
app.get("/download/:infoHash", download);
app.get("/download/:infoHash/*", download);
app.get("/playlist/:infoHash", playList);
app.get("/playlist/:infoHash/*", playList);

// handlers //

function info(req, res) {
  res.send(req.torrent.toJSON());
}

function serve(req, res) {
  const { torrent, fileIndex, filePath } = req;

  const files = torrent.files;
  let file;

  if (fileIndex < 0 || fileIndex > files.length)
    return res.status(400).send("file index is out of range");
  if (filePath) file = files.find(f => f.path === torrent.name + filePath);
  else file = files[fileIndex];

  if (!file) return res.status(404).send("file not found");
  torrents.serveFile(file, req, res);
}

function download(req, res) {
  const { torrent } = req;
  let files = req.files;
  // download custom zip file
  const custom = !!files.length;
  // let customLength = 0;
  // add all selected files with full path
  const fullPath = req.query.full_path !== false;

  // convert files indexes and paths to file info object
  if (custom) {
    const torrentName = torrent.name;
    const torrentFiles = torrent.files;
    const newFiles = [];

    files.forEach(file => {
      if (file.isPath) {
        for (let torrentFile of torrentFiles) {
          if (torrentFile.path === torrentName + "/" + file.path) {
            newFiles.push(torrentFile);
          }
        }
      } else {
        if (file.index < 0 || file.index > torrentFiles.length - 1) return;
        const selectedFile = torrentFiles[file.index];
        newFiles.push(selectedFile);
      }
    });

    files = newFiles;
  }

  // add headers
  res.attachment(`${torrent.name}${custom ? "_custom" : ""}.zip`);
  // res.setHeader("Content-Length", torrent.length);
  req.connection.setTimeout(3600000);

  // create zip file, add files and send the zip file

  const zipFile = new ZipFile();
  pump(zipFile.outputStream, res);

  (custom ? files : torrent.files).forEach(file => {
    zipFile.addReadStream(
      file.createReadStream(),
      fullPath ? file.name : file.path
    );
  });

  zipFile.end();
}

function playList(req, res) {
  const { torrent, files } = req;
  const host = (req.secure ? "https://" : "http://") + req.headers.host;
  // download custom zip file
  const custom = !!files.length;
  // playListBuilder(req, res, custom ? files : torrent.toJSON().files);

  // create playlist string
  let m3uStr =
    "#EXTM3U\n" +
    torrent
      .toJSON()
      .files.filter(
        f =>
          (f.type.startsWith("video") || f.type.startsWith("audio")) &&
          (custom
            ? !!files.find(ff => {
                if (ff.isPath && f.path === "/" + ff.path) return true;
                else if (!ff.isPath) {
                  if (ff.index >= 0 && ff.index <= torrent.files.length - 1) {
                    return (
                      f.path ===
                      torrent.files[ff.index].path.substr(torrent.name.length)
                    );
                  }
                }
              })
            : true)
      )
      .map(
        f =>
          `#EXTINF:-1,${f.name}\n${host}/api/serve/${torrent.infoHash}${f.path}`
      )
      .join("\n");

  res.send(m3uStr);
}

module.exports = app;
