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
export const getMoviesList = (options = {}) => {
  const { query, page, limit, rating, genre, sort, order } = options;
  return backend.get(
    `https://yts.lt/api/v2/list_movies.json?sort=seeds&with_rt_ratings=true&page=${page ||
      1}&query_term=${query || 0}&genre=${
      genre ? genre.toLowerCase() : "all"
    }&limit=${limit || 20}&minimum_rating=${rating || 0}&sort_by=${
      sort ? sort.toLowerCase() : "date_added"
    }&order_by=${order ? order.toLowerCase() : "desc"}`
  );
};
export const getMovieDetails = id =>
  backend.get(
    `https://yts.lt/api/v2/movie_details.json?with_images=true&with_cast=true&movie_id=${id}`
  );
export const getSuggestedMovies = id =>
  backend.get(`https://yts.lt/api/v2/movie_suggestions.json?movie_id=${id}`);
