const WebTorrent = require('webtorrent');
const pump = require('pump');
const rangeParser = require('range-parser');
const mime = require('mime');
const client = new WebTorrent();

function add(torrentId, cb) {
  let torrent = client.get(torrentId);
  if (!torrent) {
    torrent = client.add(torrentId);
    torrent.on('error', cb);
    torrent.on('ready', () => {
      torrent.jsonify = () => torrent.files.map((f, i) => ({
        name: f.name,
        index: i,
        path: f.path,
        length: f.length,
        downloaded: f.downloaded,
        torrentInfoHash: torrent.infoHash
      }));
      cb(null, torrent);
    });
  }
  else cb(null, torrent);
}

// serveFile from inside webtorrent createServer method
function serveFile(file, req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', mime.getType(file.name))

  // Support range-requests
  res.setHeader('Accept-Ranges', 'bytes')

  // Set name of file (for "Save Page As..." dialog)
  res.setHeader(
    'Content-Disposition',
    `inline; filename*=UTF-8''${file.name}`
  )

  // Support DLNA streaming
  res.setHeader('transferMode.dlna.org', 'Streaming')
  res.setHeader(
    'contentFeatures.dlna.org',
    'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000'
  )

  // `rangeParser` returns an array of ranges, or an error code (number) if
  // there was an error parsing the range.
  let range = rangeParser(file.length, req.headers.range || '')

  if (Array.isArray(range)) {
    res.statusCode = 206 // indicates that range-request was understood

    // no support for multi-range request, just use the first range
    range = range[0]

    res.setHeader(
      'Content-Range',
      `bytes ${range.start}-${range.end}/${file.length}`
    )
    res.setHeader('Content-Length', range.end - range.start + 1)
  } else {
    range = null
    res.setHeader('Content-Length', file.length)
  }

  if (req.method === 'HEAD') {
    return res.end()
  }

  pump(file.createReadStream(range), res)
}



module.exports = {
  client, add, serveFile
};
