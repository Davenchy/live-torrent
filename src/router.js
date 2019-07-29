import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Explorer from "./views/Explorer.vue";
import Player from "./views/Player.vue";
import Search from "./views/Search.vue";
import Movies from "./views/movies/Movies.vue";
import Movie from "./views/movies/Movie.vue";
import Bookmarks from "./views/Bookmarks.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/explorer",
      name: "explorer",
      component: Explorer
    },
    {
      path: "/player",
      name: "player",
      component: Player
    },
    {
      path: "/search",
      name: "search",
      component: Search
    },
    {
      path: "/movies",
      name: "movies",
      component: Movies
    },
    {
      path: "/movies/:id",
      name: "movie",
      component: Movie
    },
    {
      path: "/bookmarks",
      name: "bookmarks",
      component: Bookmarks
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/About.vue")
    },
    {
      path: "*",
      component: () => import("./views/NotFound.vue")
    }
  ]
});
