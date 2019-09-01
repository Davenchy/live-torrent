# live-torrent

Explore, stream and share torrents online.

HTML5 video player: **Plyr.js**.

Project is **Web Torrent** based.

## How to use

### Environment Variables

> Note: you can use .env file to setup vars

| Var  | Default | Desc                              |
| ---- | ------- | --------------------------------- |
| PORT | 3000    | server listening port             |
| OSUN |         | Opensubtitles.org login user name |
| OSPS |         | Opensubtitles.org login password  |
| OSUA |         | Opensubtitles.org User Agent      |

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

# then run the dev server
npm run dev
```

## Server API

### Torrent API

`/api/torrent/...`

Use Torrent API in 3 easy steps

1. select method

2. add torrent id

3. add selectors

#### Select Method

There are 5 methods

1. info `// Get information about the torrent or any file(s) inside it`

2. serve `// Serve file from inside the torrent`

3. download `// Download(.zip) all the files or some of them from inside the torrent`

4. playlist `// Download(.m3u) playlist file for all the files or some of them from inside the torrent`

5. torrentfile `// Download(.torrent) file`

#### Add Torrent Id

> torrent id can be an info hash or magnet uri or http/https torrent url

the end point can be:

1. `/api/torrent/{the selected method}/{info hash}`

2. `/api/torrent/{the selected method}?torrentId={the torrent id}`

#### Add Selectors

Query key words:

1. fileIndex -> the file index in the torrent
2. filePath -> the file path in the torrent
3. fileType -> file(s) type can be (video, audio, text, ...etc) or (.mp3, .mp4, .txt, .jpg, .vtt, .srt, ...etc)

Some Examples:

```
Files Tree

\
|-[0]- /poster.jpg
|-[1]- /movie.mp4
|-[2]- /subtitles/subtitle.en.srt
|-[3]- /subtitles/subtitle.en.vtt
|-[4]- /subtitles/subtitle.ar.srt
|-[5]- /subtitles/subtitle.ar.vtt
|-[6]- /subtitles/subtitle.fr.srt
|-[7]- /subtitles/subtitle.fr.vtt
|-[8]- /subtitles/subtitle.de.srt
|-[9]- /subtitles/subtitle.de.vtt
/
```

To get info of the movie and the english (.vtt) subtitle files [using indexes only]

`/api/torrent/info/{infoHash}?fileIndex=1&fileIndex=3`

OR

`/api/torrent/info/{infoHash}/1,3`

To get info of the movie and the english (.vtt) subtitle files [using paths only]

`/api/torrent/info/{infoHash}?filePath=movie.mp4&filePath=subtitles/subtitle.en.vtt`

OR

`/api/torrent/info/{infoHash}/movie.mp4,subtitles/subtitle.en.vtt`

To serve the first video in the torrent

`/api/torrent/serve/{infoHash}?fileType=video`

OR

`/api/torrent/serve/{infoHash}?fileType=.mp4`

OR

`/api/torrent/serve/{infoHash}/:video`

OR

`/api/torrent/serve/{infoHash}/:.mp4`

#### Real Examples

torrent info hash: `08ada5a7a6183aae1e09d831df6748d566095a10`
torrent id: `magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel`

> both gives the same results

you can use them like this

`/api/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10`

OR

`/api/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10`

OR

`/api/torrent/info?torrentId=magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel`

---

```
Files Tree

\
|-[0]- /Sintel.de.srt
|-[1]- /Sintel.en.srt
|-[2]- /Sintel.es.srt
|-[3]- /Sintel.fr.srt
|-[4]- /Sintel.it.srt
|-[5]- /Sintel.mp4
|-[6]- /Sintel.nl.srt
|-[7]- /Sintel.pl.srt
|-[8]- /Sintel.pt.srt
|-[9]- /Sintel.ru.srt
|-[10]- /poster.jpg
/
```

- Serve files

`/api/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10/Sintel.en.srt`

`/api/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10/Sintel.mp4`

`/api/torrent/info?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10/poster.jpg`

- Get Info

`/api/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10/1,5,10`

OR

`/api/torrent/info/08ada5a7a6183aae1e09d831df6748d566095a10/Sintel.en.srt,Sintel.mp4,poster.jpg`

- Download all (.srt) files in torrent as a (.zip) file

`/api/torrent/download/08ada5a7a6183aae1e09d831df6748d566095a10/:.srt`

OR

`/api/torrent/download/08ada5a7a6183aae1e09d831df6748d566095a10?fileType=.srt`

OR

`/api/torrent/download?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10&fileType=.srt`

- Download playlist (.m3u)

`/api/torrent/playlist/08ada5a7a6183aae1e09d831df6748d566095a10`

- Download torrent file (.torrent)

`/api/torrent/torrentfile/08ada5a7a6183aae1e09d831df6748d566095a10`

OR

`/api/torrent/torrentfile?torrentId=08ada5a7a6183aae1e09d831df6748d566095a10`

### Get torrent info

| Method | path                        | query                |
| ------ | --------------------------- | -------------------- |
| GET    | /api/torrent/info           | torrentId [required] |
| GET    | /api/torrent/info/:infoHash |

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

[
  {
    name: String,
    index: Number,
    path: String,
    size: Number,
    downloaded: Number,
    type: String // file mime type e.g.: video/mp4 image/jpg
  },
  ...
]

```

---

### Serving

| Method | path                                                 | query                 |
| ------ | ---------------------------------------------------- | --------------------- |
| GET    | /api/torrent/serve/:infoHash                         | fileIndex or filePath |
| GET    | /api/torrent/serve/:infoHash/{fileIndex or filePath} |                       |

> supports ranges

### Download torrent as zip archive

| Method | path                               | query                             | Desc                                                                                            |
| ------ | ---------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| GET    | /api/torrent/download              | torrentId [required]              | download all the files                                                                          |
| GET    | /api/torrent/download/:infoHash    |                                   | download all the files                                                                          |
| GET    | /api/torrent/download/:infoHash/\* | filePath or fileIndex or fileType | you can add as much as you need or use fileType to download all files with a specific file type |

examples on file types:

`/api/torrent/download?torrentId={...}&fileType=video`

`/api/torrent/download/:infoHash/fileType=.vtt`

`/api/torrent/download/:infoHash/fileType=.mp3`

### Download torrent as playlist [.m3u]

| Method | path                            | query                |
| ------ | ------------------------------- | -------------------- |
| GET    | /api/torrent/playlist           | torrentId [required] |
| GET    | /api/torrent/playlist/:infoHash |

### Download torrent file [.torrent]

| Method | path                       | query                |
| ------ | -------------------------- | -------------------- |
| GET    | /api/torrentFile           | torrentId [required] |
| GET    | /api/torrentFile/:infoHash |

### Torrent Search Engine

| Method | path                  | query                                                                  |
| ------ | --------------------- | ---------------------------------------------------------------------- |
| GET    | /api/search           | query[required], provider, category[default="All"], limit[default=100] |
| GET    | /api/search/providers |

> if no provider will search using all providers [takes too long time]

### Captions

| Method | path                 | query                                       | desc                                     |
| ------ | -------------------- | ------------------------------------------- | ---------------------------------------- |
| GET    | /api/captions/search | query, lang, limit, imdbid, season, episode | for more info check opensubtitle.org api |

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

---

## Frontend API

| Path      | query                              | description                                                                                                                                         |
| --------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| /         | [query]                            | quick way to add torrentId and explore it                                                                                                           |
| /movies   | [query, limit, rating, genre]      | search movies                                                                                                                                       |
| /search   | [query, limit, category, provider] | providers: [all, 1337x, ExtraTorrent, KickassTorrents, Rarbg, ThePirateBay], the most used categories: [All, Movies, TV, Music, Apps, Anime, Books] |
| /explorer | torrentId                          | explore torrent file using its torrent id (http/https torrent file or info hash or magnet uri)                                                      |
| /player   | torrentId, fileIndex, [caption]    | play video or audio file using torrentId and the file index, find more about captions below                                                         |

### Media player and Captions

to add captions to the player **you can use the gui or url query**

send caption query as much as you need

Caption Scheme types:

1. text
2. url
3. imdbid

Caption Scheme can be:

`caption={type}::{label}::{language-code}::{encoding}::{data}&...`

or

`caption={type}::{label}::{language-code}::{data}&...`

or

`caption={type}::{label}::{data}&...`

or

`caption={type}::{data}&...`

---

Examples:

`caption=text::English::en::utf8::{subtitle file content here...}`

`caption=text::English::en::{subtitle file content here...}`

`caption=url::English::en::https://...`

`caption=imdbid::1877832`
