import axios from "axios";

const backend = axios.create({
  baseURL: "/api"
});
export default backend;

// torrent service
export const getTorrentInfo = torrentId =>
  backend.get("/info?torrentId=" + torrentId);
export const searchProviders = () => backend.get("/search/providers");
export const searchEngine = params => backend.get(`/search`, { params });

// yts movies service
export const getMoviesList = (page = 1) =>
  backend.get(
    `https://yts.lt/api/v2/list_movies.json?sort=seeds&with_rt_ratings=true&page=${page}`
  );
export const getMovieDetails = id =>
  backend.get(
    `https://yts.lt/api/v2/movie_details.json?with_images=true&with_cast=true&movie_id=${id}`
  );
export const movieSuggestions = id =>
  backend.get(`https://yts.lt/api/v2/movie_suggestions.json?movie_id=${id}`);
