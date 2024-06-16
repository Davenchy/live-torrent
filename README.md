# Live Torrent V4

## Project Status and Updates

This project is outdated, and this Docker [image](https://hub.docker.com/repository/docker/davenchy/live-torrent) is likely the only functional version. However, many functionalities within the image are outdated and no longer work.

I have rewritten the [backend server](https://github.com/Davenchy/live-torrent-backend) to be up-to-date and functional.

The frontend **has not been updated yet**, and there is no estimated time for its update, but I will address it in the future.

### Rebuilding Live Torrent with __Next.js ❤️__ flavor from scratch.

> In progress

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

### Manage Docker Container

- run/create a new container

```sh
docker run --name=live-torrent-next -d -p 3000:3000 live-torrent-next
```

> OR use our pre-built image form docker hub `davenchy/live-torrent-next:latest`

```sh
docker run --name=live-torrent-next -d -p 3000:3000 davenchy/live-torrent-next:latest
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

- The __OSUA__ enviroment variable must be set to your opensubtitles user agent. It is not mandatory to set but it is required to fetch subtitles.

- To get your own __OpenSubtitles_User_Agent__ check this [link](https://trac.opensubtitles.org/projects/opensubtitles/wiki/DevReadFirst#Howtorequestanewuseragent)
