# live-stream

Explore, stream and share torrents online

Player page framework: __Plyr.js__

__Web Torrent based__


## Server API

### Get torrent info

Method | path | params
----|----|----
GET | /torrent/stream | torrentId, fileIndex

response:

```javascript
{
  infoHash: String,
  files: [Object]
}

```

The File Object:

```javascript

{
  name: String,
  index: Number,
  path: String,
  length: Number,
  downloaded: Number,
  type: String // file mime type e.g.: video/mp4 image/jpg
}

```

______

### Streaming

Method | path | params
-------|-----|-------
GET | /torrent/stream | torrentId, fileIndex

torrentId:

- magnet-uri
- http/https torrent file
- torrent infoHash

> supports ranges


## Front-End Routes

Explorer

params:

- torrendId [required]

---

Player

params:

- torrentId [required]
- fileIndex [required]
- subtitle
