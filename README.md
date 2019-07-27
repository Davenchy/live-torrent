# live-torrent

Explore, stream and share torrents online.

HTML5 video player: **Plyr.js**.

Project is **Web Torrent** based.

## How to use

### Environment Variables

> Note: you can use .env file to setup vars

| Var  | Default | Desc                  |
| ---- | ------- | --------------------- |
| PORT | 3000    | server listening port |

### For Users

```bash
# install dependencies
npm install

# build frontend
npm run build

# start the server
npm start
# or
npm run torrent-server
```

### For Developers

```bash
# install dependencies
npm install -D

# run torrent api server
npm run torrent-server-dev

# compile and hot-reloads vue.js frontend
npm run serve
```

#### To Build Frontend

```bash
npm run build
```

## Server API

### Get torrent info

| Method | path                | query                |
| ------ | ------------------- | -------------------- |
| GET    | /api/info           | torrentId [required] |
| GET    | /api/info/:infoHash |

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

---

### Streaming

| Method | path                             | query                                         |
| ------ | -------------------------------- | --------------------------------------------- |
| GET    | /api/stream                      | torrentId [required], fileIndex [default = 0] |
| GET    | /api/stream/:infoHash/:fileIndex |

torrentId can be:

- magnet-uri
- http/https torrent file
- torrent infoHash

> supports ranges

### Download torrent as zip archive

| Method | path                    | query                |
| ------ | ----------------------- | -------------------- |
| GET    | /api/download           | torrentId [required] |
| GET    | /api/download/:infoHash |

### Download torrent as playlist [.m3u]

| Method | path                    | query                |
| ------ | ----------------------- | -------------------- |
| GET    | /api/playlist           | torrentId [required] |
| GET    | /api/playlist/:infoHash |

### Download torrent file [.torrent]

| Method | path                       | query                |
| ------ | -------------------------- | -------------------- |
| GET    | /api/torrentfile           | torrentId [required] |
| GET    | /api/torrentfile/:infoHash |

### SRT to VTT [.vtt]

| Method | path         | query           | body                             |
| ------ | ------------ | --------------- | -------------------------------- |
| GET    | /api/srt2vtt | path [required] |
| POST   | /api/srt2vtt |                 | srt [srt file content][required] |

### Torrent Search Engine

| Method | path                  | query                                                                  |
| ------ | --------------------- | ---------------------------------------------------------------------- |
| GET    | /api/search           | query[required], provider, category[default="All"], limit[default=100] |
| GET    | /api/search/providers |

> if no provider will search using all providers [takes too long time]

### Subtitles

| Method | path                   | query |
| ------ | ---------------------- | ----- |
| GET    | /api/captions/:imdb-id |

the first endpoint returns array of objects contains subtitle info and url

```javascript
[
  {
    "url": "...",
    "langcode": "en",
    "downloads": 105677,
    "lang": "English",
    "encoding": "UTF-8",
    "id": "1954422981",
    "filename": "X-Men.Days.of.Future.Past.2014.720p.BluRay.X264-AMIABLE.srt",
    "date": "2014-10-04 16:22:07",
    "score": 0.5,
    "fps": 23.976,
    "format": "srt",
    "utf8": "...",
    "vtt": "..."
  },
  ...
]
```

## Frontend API

| Path      | params                          | description                                                                                    |
| --------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| /         | [q]                             | [coming soon]                                                                                  |
| /movies   | [query, limit, rating, genre]   | search movies                                                                                  |
| /explorer | torrentId                       | explore torrent file using its torrent id (http/https torrent file or info hash or magnet uri) |
| /player   | torrentId, fileIndex, [caption] | play video or audio file using torrentId and the file index, find more about captions below    |

### Media player and Captions

to add captions to the player **you can use the gui or request params**

send captions params as must as you need

Caption Scheme types:

1. text
2. url
3. imdbid

Caption Scheme can be:

`caption={type}::{label}::{language-code}::{data}&...`

or

`caption={type}::{label}::{data}&...`

or

`caption={type}::{data}&...`

---

Examples:

`caption=texy::English::en::{subtitle file content here...}`

`caption=url::English::en::https://...`

`caption=imdbid::1877832`
