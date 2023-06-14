import { trackers } from 'core/utils/torrent-trackers'
import rangeParser from 'range-parser'
import WebTorrent from 'webtorrent'
import mime from 'mime'
import pump from 'pump'
import { TorrentInfo } from 'types'

const client = new WebTorrent()


/** converts torrent into json format to ease server/client sharing */
export const torrentToJson = (torrent: WebTorrent.Torrent): TorrentInfo => ({
	name: torrent.name,
	infoHash: torrent.infoHash,
	size: Math.max(torrent.length, 0),
	peers: torrent.numPeers,
	downloaded: Math.max(torrent.downloaded, 0),
	files: torrent.files.map(file => ({
		name: file.name,
		path: file.path,
		size: Math.max(file.length, 0),
		type: mime.getType(file.name) || "application/octet-stream",
		downloaded: Math.max(file.downloaded, 0)
	}))
})

/**
 * request torrent object by its id or info hash
 */
export const requestTorrent = async (torrentId: string):
	Promise<WebTorrent.Torrent> =>
	new Promise((resolve, reject) => {
		const torrent = client.add(torrentId, { announce: trackers })
		torrent.on('error', (err: Error) => {
			if (err.message.indexOf("Cannot add duplicate torrent") !== -1) 
				resolve(client.get(torrent.infoHash) as WebTorrent.Torrent)
			reject(err)
		})
		torrent.on('ready', () => {
			torrent.pause()
			for (let file of torrent.files)
				file.deselect()
			resolve(torrent)
		})
	})

/**
 * serveFile if a function from inside webtorrent createServer method
 *
 * @function
 * @param {object} file
 * @param {Object} req - express middleware req
 * @param {Object} res - express middleware res
 */
export const serveFile = (file: WebTorrent.TorrentFile, req, res) => {
  if (!file) {
    res.statusCode = 404;
    return res.send();
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", mime.getType(file.name));

  // Support range-requests
  res.setHeader("Accept-Ranges", "bytes");

  // Set name of file (for "Save Page As..." dialog)
  // res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${file.name}`);
  res.attachment(file.name);

  // `rangeParser` returns an array of ranges, or an error code (number) if
  // there was an error parsing the range.
  let range = rangeParser(file.length, req.headers.range || "");

  if (Array.isArray(range)) {
    res.statusCode = 206; // indicates that range-request was understood

    // no support for multi-range request, just use the first range
    // @ts-ignore
    range = range[0];

    res.setHeader(
      "Content-Range",
      // @ts-ignore
      `bytes ${range.start}-${range.end}/${file.length}`
    );
    // @ts-ignore
    res.setHeader("Content-Length", range.end - range.start + 1);
  } else {
    range = null;
    res.setHeader("Content-Length", file.length);
  }

  if (req.method === "HEAD") {
    return res.end();
  }

  // @ts-ignore
  pump(file.createReadStream(range), res);
}
