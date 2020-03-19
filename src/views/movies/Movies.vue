<template>
  <v-container fluid>
    <v-layout raw wrap xs12>
      <v-flex xs12 class="my-5 text-xs-center">
        <h1>Torrent Movies</h1>
      </v-flex>

      <v-flex xs12>
        <v-combobox
          solo
          light
          clearable
          cache-items
          hide-no-data
          return-object
          item-text="title"
          loader-height="5"
          item-value="title"
          placeholder="Looking for"
          :disabled="loading"
          :items="suggestions"
          :loading="thinking || loading"
          :autofocus="!$vuetify.breakpoint.xsOnly"
          :search-input.sync="query"
          @click:clear="clearResults"
          @change="openSuggestion($event)"
          @keydown.enter.native="search(true)"
          @input.native="updateSuggestions"
        >
          <template v-slot:item="{ item }">
            <div>
              <v-avatar :size="45">
                <img :src="item.small_cover_image" :alt="`${item.title}'s cover`" />
              </v-avatar>
              <span class="mx-3">
                <span v-html="maskSuggestion(item.title)"></span>
                - {{ item.year }}
              </span>
              <span v-if="$vuetify.breakpoint.mdAndUp">
                <v-chip
                  v-for="(genre, i) in item.genres"
                  :key="i"
                  label
                  small
                  class="mx-2"
                  color="primary"
                >{{ genre }}</v-chip>
              </span>
            </div>
          </template>
        </v-combobox>
      </v-flex>

      <v-flex xs12 mb-5>
        <v-layout row wrap>
          <v-flex xs12 sm4 lg4 pa-2>
            <v-select
              solo
              v-model="sort"
              :disabled="loading"
              hide-details
              light
              :menu-props="{
                light: true,
                top: true,
                offsetY: true,
                offsetOverflow: true
              }"
              single-line
              :items="[
                { text: 'Title', value: 'title' },
                { text: 'Year', value: 'year' },
                { text: 'Rating', value: 'rating' },
                { text: 'Peers', value: 'peers' },
                { text: 'Seeds', value: 'seeds' },
                { text: 'Downloads', value: 'download_count' },
                { text: 'Popularity', value: 'likes_count' },
                { text: 'Upload Date', value: 'date_added' }
              ]"
            >
              <template v-slot:prepend-inner>
                <div class="select-text">Order:</div>
              </template>
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 lg4 pa-2>
            <v-select
              solo
              v-model="genre"
              :disabled="loading"
              light
              :menu-props="{
                light: true,
                top: true,
                offsetY: true,
                offsetOverflow: true
              }"
              hide-details
              single-line
              :items="[
                { text: 'All', value: 'all' },
                { text: 'Action', value: 'action' },
                { text: 'Adventure', value: 'adventure' },
                { text: 'Animation', value: 'animation' },
                { text: 'Biography', value: 'biography' },
                { text: 'Comedy', value: 'comedy' },
                { text: 'Crime', value: 'crime' },
                { text: 'Documentary', value: 'documentary' },
                { text: 'Drama', value: 'drama' },
                { text: 'Family', value: 'family' },
                { text: 'Fantasy', value: 'fantasy' },
                { text: 'Film-Noir', value: 'film-noir' },
                { text: 'Game-Show', value: 'game-show' },
                { text: 'History', value: 'history' },
                { text: 'Horror', value: 'horror' },
                { text: 'Music', value: 'music' },
                { text: 'Musical', value: 'musical' },
                { text: 'Mystery', value: 'mystery' },
                { text: 'News', value: 'news' },
                { text: 'Reality Tv', value: 'reality-tv' },
                { text: 'Romance', value: 'romance' },
                { text: 'Sci-Fi', value: 'sci-fi' },
                { text: 'Sport', value: 'sport' },
                { text: 'Talk-Show', value: 'talk-show' },
                { text: 'Thriller', value: 'thriller' },
                { text: 'War', value: 'war' },
                { text: 'Western', value: 'western' }
              ]"
            >
              <template v-slot:prepend-inner>
                <div class="select-text">Genre:</div>
              </template>
            </v-select>
          </v-flex>
          <v-flex xs12 sm4 lg4 pa-2>
            <v-select
              v-model="order"
              solo
              :menu-props="{
                light: true,
                top: true,
                offsetY: true,
                offsetOverflow: true
              }"
              :disabled="loading"
              light
              hide-details
              single-line
              :items="[
                { text: 'Ascending', value: 'asc' },
                { text: 'Descending', value: 'desc' }
              ]"
            >
              <template v-slot:prepend-inner>
                <div class="select-text">Sort:</div>
              </template>
            </v-select>
          </v-flex>
          <v-flex xs12 pa-2 my-3 class="text-xs-center">
            <div class="subheading">Minimum Rating:</div>
            <v-rating v-model="rating" color="yellow" half-increments hover :disabled="loading" />
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn color="green" @click="search(true)" :disabled="loading">
              <v-icon left>fas fa-search</v-icon>Search
            </v-btn>
            <v-btn color="blue" @click="random" :disabled="loading">
              <v-icon left>fas fa-dice</v-icon>Random
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 v-if="movies" class="text-xs-center mb-5">
        <v-layout row>
          <v-btn icon large @click="cpage > 1 ? cpage-- : null" :disabled="loading">
            <v-icon>fas fa-chevron-left</v-icon>
          </v-btn>
          <v-select
            dark
            label="Page Number"
            v-model="cpage"
            :items="generatedPages"
            :disabled="loading"
            hide-details
            single-line
          />
          <v-btn icon large @click="cpage < pages ? cpage++ : null" :disabled="loading">
            <v-icon>fas fa-chevron-right</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs12 v-if="movies">
        <v-layout row wrap>
          <v-flex
            xs12
            sm4
            md3
            xl2
            v-for="(movie, index) in movies"
            :key="movie.id"
            class="pa-3 double-ms"
          >
            <movie-card :movie="movie" :tabindex="index" class="my-card" />
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex class="text-xs-center" v-else>
        <h1 class="title">No Results.</h1>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3 v-if="movies" class="text-xs-center mb-5">
        <v-layout row>
          <v-btn icon large @click="cpage > 1 ? cpage-- : null" :disabled="loading">
            <v-icon>fas fa-chevron-left</v-icon>
          </v-btn>
          <v-select
            dark
            label="Page Number"
            v-model="cpage"
            :items="generatedPages"
            :disabled="loading"
            hide-details
            single-line
          />
          <v-btn icon large @click="cpage < pages ? cpage++ : null" :disabled="loading">
            <v-icon>fas fa-chevron-right</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MovieCard from "../../components/MovieCard";
import { mapActions, mapGetters } from "vuex";
import { getMoviesList } from "../../utils/axios";
import BookmarkButton from "../../components/BookmarkButton";

export default {
  components: {
    MovieCard,
    BookmarkButton
  },
  data() {
    return {
      query: "",
      rating: 0,
      order: "desc",
      sort: "date_added",
      genre: "all",
      loading: false,
      thinking: false,
      cpage: 1,
      generatedPages: [],
      suggestions: []
    };
  },
  methods: {
    ...mapActions(["loadMoviesList"]),
    readStorage(key) {
      const value = sessionStorage.getItem(key);
      return value !== null ? value : undefined;
    },
    openSuggestion(item) {
      sessionStorage.setItem("mse.query", item.title || item || "");
      if (typeof item !== "string") this.$router.push("/movies/" + item.id);
    },
    updateSuggestions() {
      this.thinking = true;
      getMoviesList({ query: this.query })
        .then(res => {
          if (res.data.status !== "ok")
            throw new Error(res.data.status_message);

          const data = res.data.data;
          if (data.movie_count === 0) return;
          this.suggestions = data.movies;
        })
        .catch(err => {
          console.log(err);
          this.Toast.fire({
            title: err.message,
            type: "error"
          });
        })
        .finally(() => (this.thinking = false));
    },
    search(resetPages = false) {
      if (resetPages) this.cpage = 1;

      const params = {
        query: this.query,
        rate: (this.rating * 10) / 5,
        order: this.order,
        sort: this.sort,
        genre: this.genre,
        page: this.cpage
      };

      this.loading = true;
      this.loadMoviesList(params)
        .catch(err => {
          console.error(err);
          this.Toast.fire({
            title: err.message,
            type: "error"
          });
        })
        .finally(() => (this.loading = false));
    },
    random() {
      let params = {
        query: this.query,
        rate: (this.rating * 10) / 5,
        order: this.order,
        sort: this.sort,
        genre: this.genre
      };

      this.loading = true;
      getMoviesList(params)
        .then(res => {
          if (res.data.status !== "ok")
            throw new Error(res.data.status_message);

          const data = res.data.data;
          const n = Math.round(Math.random() * (data.movie_count - 1) + 1);
          if (data.movie_count === 0) params = {};

          return getMoviesList({ ...params, limit: 1, page: n }).then(res => {
            if (res.data.status !== "ok")
              throw new Error(res.data.status_message);

            this.$router.push("/movies/" + res.data.data.movies[0].id);
          });
        })
        .catch(err => {
          console.log(err);
          this.Toast.fire({
            title: err.message,
            type: "error"
          });
        })
        .finally(() => (this.loading = false));
    },
    clearResults() {
      this.query = "";
      this.search(true);
    },
    maskSuggestion(text) {
      return text.replace(
        new RegExp(this.query, "gi"),
        a =>
          `<span style="background-color: #494949; color: rgba(255, 255, 255, 0.5);">${a}</span>`
      );
    }
  },
  watch: {
    cpage(n) {
      sessionStorage.setItem("mse.page", n);
      this.search();
    },
    pages(n) {
      this.generatedPages = [];
      if (n === 1)
        return (this.generatedPages = [{ text: "Page 1 Of 1", value: 1 }]);
      for (let i = 0; i < this.pages; i++)
        this.generatedPages.push({
          text: `Page ${i + 1} Of ${n}`,
          value: i + 1
        });
    },
    query: n => sessionStorage.setItem("mse.query", n || ""),
    rating: n => sessionStorage.setItem("mse.rating", n || 0),
    order: n => sessionStorage.setItem("mse.order", n || "desc"),
    sort: n => sessionStorage.setItem("mse.sort", n || "date_added"),
    genre: n => sessionStorage.setItem("mse.genre", n || "all")
  },
  computed: {
    ...mapGetters(["page", "pages", "movies"])
  },
  created() {
    const { readStorage } = this;
    document.title = "Live Torrent - Movies";
    const { query, genre, rating } = this.$route.query;
    this.query = query || readStorage("mse.query") || "";
    this.rating =
      parseInt(rating) || parseFloat(readStorage("mse.rating")) || 0;
    this.order = readStorage("mse.order") || "desc";
    this.sort = readStorage("mse.sort") || "date_added";
    this.genre = genre || readStorage("mse.genre") || "all";

    this.search(true);
  }
};
</script>

<style lang="scss" scoped>
.double-ms {
  @media only screen and (min-width: 400px) and (max-width: 799px) {
    max-width: 50%;
  }
}

.select-text {
  color: #222;
}
</style>
