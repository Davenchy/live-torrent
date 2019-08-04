import {
  getMoviesList,
  getSuggestedMovies,
  getMovieDetails
} from "../utils/axios";

export default {
  state: {
    res: null
  },
  getters: {
    page: ({ res }) => (res ? res.page_number : 1),
    pages: ({ res }) => (res ? Math.ceil(res.movie_count / res.limit) : 1),
    movies: ({ res }) => (res ? res.movies : [])
  },
  mutations: {
    setResponseData: (s, r) => (s.res = r || null)
  },
  actions: {
    loadMoviesList({ commit }, params = {}) {
      return getMoviesList(params).then(res => {
        if (res.data.status !== "ok") throw new Error(res.data.status_message);
        commit("setResponseData", res.data.data);
        return res.data.data;
      });
    },
    loadMovieDetails(state, id) {
      return getMovieDetails(id).then(res => {
        if (res.data.status !== "ok") throw new Error(res.data.status_message);
        return res.data.data.movie;
      });
    },
    loadSuggestedMovies(state, id) {
      return getSuggestedMovies(id).then(res => {
        if (res.data.status !== "ok") throw new Error(res.data.status_message);
        return res.data.data.movies;
      });
    },
    loadMoviePage({ dispatch }, id) {
      return dispatch("loadMovieDetails", id).then(movie => {
        return dispatch("loadSuggestedMovies", id).then(suggestedMovies => {
          return {
            ...movie,
            suggestedMovies
          };
        });
      });
    }
  }
};
