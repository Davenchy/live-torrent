# live-torrent

Search, explore and download torrent files online.

the backend package is [live-torrent-backend](https://github.com/Davenchy/live-torrent-backend)

## Install

```
# clone the project
git clone https://github.com/Davenchy/live-torrent
cd live-torrent

# then install dependencies
npm install

# build frontend
npm run build

# create the .env file more information below
# run the server
npm start
```

### The .ENV file

Live torrent needs some environment variables you can define them in the terminal or in a `.env` file

| Variable Name | Default Value | Description |
| ------------- | ------------- | ----------- |
| PORT | 3000 | the server listening port |
| OSUA | TemporaryUserAgent | the opensubtitles.org api user agent |

for more information about the backend from [here](https://github.com/Davenchy/live-torrent-backend/wiki/How-to-use#environment-variables).

for more information about the OpenSubtitles.org api user agent from [here](https://trac.opensubtitles.org/projects/opensubtitles/wiki/DevReadFirst)

## Docker

### Build

```
# create image
# docker build -t <image-name> .
docker build -t live-torrent

# create container
# docker container create --name <container-name> -p <port>:8080 -e "OSUA=<opensubtitles-useragent>" <image-name>
docker container create --name live-torrent -p 8080:8080 live-torrent
```

### Install

```
# docker run --name <container-name> -p <port>:8080 -e "OSUA=<opensubtitles-useragent>" -d davenchy/live-torrent
docker run --name live-torrent -p 8080:8080 -d davenchy/live-torrent
```

### Use it

```
# start live-torrent server
# docker start <container-name>
docker start live-torrent

# stop live-torrent server
# docker stop <container-name>
docker stop live-torrent

# check running processes
docker ps
```

## Frontend API

| Path      | query                              | description                                                                                                                                         |
| --------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| /         | [query]                            | quick way to add torrentId and explore it                                                                                                           |
| /movies   | [query, limit, rating, genre]      | search movies                                                                                                                                       |
| /search   | [query, limit, category, provider] | providers: [all, 1337x, ExtraTorrent, KickassTorrents, Rarbg, ThePirateBay], the most used categories: [All, Movies, TV, Music, Apps, Anime, Books] |
| /explorer | torrentId                          | explore torrent file using its torrent id (http/https torrent file or info hash or magnet uri)                                                      |
| /player   | torrentId, fileIndex, [caption]    | play video or audio file using torrentId and the file index, find more about captions below                                                         |
