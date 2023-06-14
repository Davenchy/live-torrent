# Live Torrent V4

### Live Torrent with __React.js__ flavor ❤️

Search, explore, download and stream torrent files online.

Watch online YTS movies with subtitles in any language.

Now all in one fullstack package.

## Install and Build

```
# clone the project
git clone --depth=1 https://github.com/Davenchy/live-torrent.git

# change working directory
cd live-torrent

# then install dependencies
npm install

# now lets's build our project
npm run build

# finally get ready
npm start

#######################################################################

# create the .env file more information in the .ENV section below
echo "PORT=<your port>\nOSUA=<your opensubtitles user agent>" > .env

# run the server
npm start

################################ OR ###################################

# run the server with env vars
PORT=???? OSUA=?????????? npm start

```

### Environment Variables

Live Torrent depends on other services like OpenSubtitles,
So to use subtitles on your own build,
you will need to request OpenSubtitles API key from opensubtitles.org

| Variable Name | Default Value      | Description                          |
| ------------- | ------------------ | ------------------------------------ |
| PORT          | 3000               | the server listening port            |
| OSUA          | TemporaryUserAgent | the opensubtitles.org api user agent |

## Docker

- Docker repo: `davenchy/live-torrent`

`docker run --name live-torrent -d -p <PORT>:8080 -e "OSUA=<your opensubtitles user agent>" live-torrent`
