# live-torrent

Explore, stream and share torrents online

HTML5 video player: __Plyr.js__

project is __Web Torrent based__

## How to use

### Environment Variables

> Note: you can use .env file to setup vars

Var | Default | Desc
----|---------|-----
PORT | 3000 | server listening port

### For Users

```bash
# clone the project
git clone https://github.com/Davenchy/live-torrent.git

# install dependencies
npm i

# start the server
npm start
```

### For Developers

```bash
# clone the project
git clone https://github.com/Davenchy/live-torrent.git

# install dependencies
npm i -D

# run dev server
npm run dev
```


## Server API

### Get torrent info

Method | path | params
----|----|----
GET | /torrent/info | torrentId [required]
GET | /torrent/info/:infoHash

response:

```javascript
{
  name: String,
  infoHash: String,
  size: Number,
  peers: Number,
  files: [Object]
}

```

The File Object:

```javascript

{
  name: String,
  index: Number,
  path: String,
  size: Number,
  downloaded: Number,
  type: String // file mime type e.g.: video/mp4 image/jpg
}

```

______

### Streaming

Method | path | params
-------|-----|-------
GET | /torrent/stream | torrentId [required], fileIndex [default = 0]
GET | /torrent/stream/:infoHash/:fileIndex

torrentId can be:

- magnet-uri
- http/https torrent file
- torrent infoHash

> supports ranges

### Download torrent as zip archive

Method | path | params
-------|-----|-------
GET | /torrent/download | torrentId [required]
GET | /torrent/download/:infoHash

### Download torrent as playlist [.m3u]

Method | path | params
-------|-----|-------
GET | /torrent/playlist | torrentId [required]
GET | /torrent/playlist/:infoHash

## Front-End Routes

Route | Params
------|-------
/explorer | torrentId[required]
/player | torrentId[required], fileIndex[required]