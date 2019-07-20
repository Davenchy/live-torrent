import axios from "axios";

const backend = axios.create({
  baseURL: "/api"
});

export default {
  backend,
  getTorrentInfo(torrentId) {
    return backend.get("/info?torrentId=" + torrentId);
  }
};
