import axios from "axios";

const backend = axios.create({
  baseURL: "/api"
});

export default backend;

export const getTorrentInfo = torrentId =>
  backend.get("/info?torrentId=" + torrentId);
export const searchProviders = () => backend.get("/search/providers");
export const searchEngine = params => backend.get(`/search`, { params });
