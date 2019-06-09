module.exports = function (req, res) {
    const host = (req.secure ? "https://" : "http://") + req.headers.host;
    const { torrent } = req;
    
    let m3u = torrent.files
        .filter(f => f.type.startsWith('video') || f.type.startsWith('audio'))
        .map(f => `${host}/torrent/stream/${torrent.infoHash}/${f.index}`)
        .join('/n');
    
    res.attachment(torrent.name + '.m3u');
    res.setHeader('Content-Length', m3u.length);
    res.setHeader('Content-Type', 'application/mpegurl');
    req.connection.setTimeout(30000);

    res.send(m3u);
}