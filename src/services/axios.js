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
export const getMoviesList = (params = {}) =>
  backend.get("https://yts.lt/api/v2/list_movies.json", {
    params: {
      query_term: 0,
      with_rt_ratings: true,
      page: 1,
      genre: "all",
      limit: 20,
      minimum_rating: 0,
      sort_by: "date_added",
      order_by: "desc",
      ...params
    }
  });
export const getMovieDetails = id =>
  backend.get(
    `https://yts.lt/api/v2/movie_details.json?with_images=true&with_cast=true&movie_id=${id}`
  );
export const getSuggestedMovies = id =>
  backend.get(`https://yts.lt/api/v2/movie_suggestions.json?movie_id=${id}`);

//  movies captions
export const loadCaptions = imdbID => backend.get("/captions/" + imdbID);
