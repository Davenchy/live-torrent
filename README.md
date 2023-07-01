# Live Torrent V4

### Reimplementing Live Torrent with __Next.js ❤️__ flavor.

Search, explore, download and stream torrent files online.

Watch online YTS movies with subtitles in any language.

Now all in one fullstack package.

## Install and Build

```
# clone the project
git clone --depth=1 --single-branch https://github.com/Davenchy/live-torrent.git

# change working directory
cd live-torrent

# then install dependencies
npm install

# now lets's build our project
npm run build

# finally get ready
npm start
```

## Docker

### Build Docker Image

```sh
docker build -t live-torrent-next .
```

### Run Docker Container

- run/create a new container

```sh
docker run --name=live-torrent-next -d -p 3000:3000 live-torrent-next
```

- start the container

```sh
docker start live-torrent-next
```

- stop the container

```sh
docker stop live-torrent-next
```

### Old LiveTorrent

- To pull the old LiveTorrent docker image

```sh
docker pull davenchy/live-torrent
```

- To run a container for the old LiveTorrent

```sh
docker run --name=live-torrent -d -p 3000:8080 -e "OSUA=<your opensubtitles user agent>" davenchy/live-torrent
```

- The __OSUA__ enviroment variable must be set to your opensubtitles user agent.

It is not mandatory to run but it is required to fetch subtitles.
