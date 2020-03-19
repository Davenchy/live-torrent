# live-torrent

Search, explore and download torrent files online.

Watch online YTS movies with subtitles.

the backend package is [live-torrent-backend](https://github.com/Davenchy/live-torrent-backend)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Davenchy/live-torrent)

## Install and Build

```
# clone the project
git clone https://github.com/Davenchy/live-torrent && cd live-torrent

# then install dependencies
npm install

# build frontend
npm run build

#######################################################################

# create the .env file more information in the .ENV section below
echo "PORT=<your port>\nOSUA=<your opensubtitles user agent>" > .env

# run the server
npm start

################################ OR ###################################

# run the server with env vars
PORT=???? OSUA=?????????? npm start

```

### The .ENV file

Live torrent needs some environment variables you can define them in the terminal or in a `.env` file

| Variable Name | Default Value      | Description                          |
| ------------- | ------------------ | ------------------------------------ |
| PORT          | 3000               | the server listening port            |
| OSUA          | TemporaryUserAgent | the opensubtitles.org api user agent |

for more information about the backend from [here](https://github.com/Davenchy/live-torrent-backend/wiki/How-to-use#environment-variables).

for more information about the OpenSubtitles.org api user agent from [here](https://trac.opensubtitles.org/projects/opensubtitles/wiki/DevReadFirst)

## Docker

- Docker repo: `davenchy/live-torrent`

`docker run --name live-torrent -d -p <PORT>:8080 -e "OSUA=<your opensubtitles user agent>" live-torrent`

## Frontend API

> Soon
