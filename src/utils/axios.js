import axios from "axios";

const backend = axios.create({
  baseURL: "/api"
});
export default backend;

// torrent service
export const getTorrentInfo = torrentId =>
  backend.get("/torrent/info?torrentId=" + torrentId);
export const searchProviders = () => backend.get("/search/providers");
export const searchEngine = params => backend.get(`/search`, { params });

// yts movies service
export const getMoviesList = (params = {}) =>
  backend.get("/yts/list", { params });
export const getMovieDetails = id => backend.get(`/yts/movie/${id}`);
export const getSuggestedMovies = id =>
  backend.get(`/yts/movie/${id}/suggestions`);

//  movies captions
export const loadCaptions = imdbID => backend.get(`/captions?imdbid=${imdbID}`);
