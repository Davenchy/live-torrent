FROM node:12

LABEL maintainer "Davenchy <firon1222@gmail.com>"
LABEL description "Build Live-Torrent server image"
LABEL version "3.0"

WORKDIR /usr/src/app

COPY package*.json ./

ENV PORT 8080

RUN npm install

COPY . ./
RUN npm run build

ENV NODE_ENV production
RUN npm ci --only=production

EXPOSE 8080
CMD ["npm", "start"]
