<template>
  <v-container fluid>
    <v-layout raw wrap xs12>
      <v-flex xs12 class="my-5 text-xs-center">
        <h1>Torrent Movies</h1>
      </v-flex>

      <v-flex xs12 md8 offset-md2 mb-2>
        <v-text-field
          placeholder="Looking for..."
          solo
          light
          :loading="loading"
          clearable
          :disabled="loading"
          :autofocus="!$vuetify.breakpoint.xsOnly"
          v-model="query"
          @keydown.enter="search(true)"
          :error-messages="errors"
          @click:clear="clearResults"
        />
      </v-flex>

      <v-flex xs12 mb-5>
        <v-layout row wrap>
          <v-flex xs12 sm6 lg3 offset-lg3 pa-2>
            <div class="subheading">Minimum Rating:</div>
            <v-rating v-model="rating" color="yellow" half-increments hover :disabled="loading" />
          </v-flex>
          <v-flex xs12 sm6 lg3 pa-2>
            <v-text-field
              label="Results Per Page"
              type="number"
              hide-details
              min="10"
              max="100"
              v-model="limit"
              :disabled="loading"
            />
          </v-flex>
          <v-flex xs12 sm4 lg4 pa-2>
            <v-select
              label="Orderd By"
              v-model="order"
              solo
              suffix="Order"
              :disabled="loading"
              light
              hide-details
              single-line
              :items="[
                      { text: 'Ascending', value: 'asc' },
                      { text: 'Descending', value: 'desc' }
                      ]"
            />
          </v-flex>
          <v-flex xs12 sm4 lg4 pa-2>
            <v-select
              label="Sort By"
              solo
              v-model="sort"
              :disabled="loading"
              light
              hide-details
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
            />
          </v-flex>
          <v-flex xs12 sm4 lg4 pa-2>
            <v-select
              label="Genre"
              solo
              v-model="genre"
              :disabled="loading"
              light
              hide-details
              single-line
              :items="[
                      { text: 'All', value: 'all' },
                      { text: 'Comedy', value: 'comedy' },
                      { text: 'Sci-Fi', value: 'sci-fi' },
                      { text: 'Horror', value: 'horror' },
                      { text: 'Romance', value: 'romance' },
                      { text: 'Action', value: 'action' },
                      { text: 'Thriller', value: 'thriller' },
                      { text: 'Drama', value: 'drama' },
                      { text: 'Mystery', value: 'mystery' },
                      { text: 'Crime', value: 'crime' },
                      { text: 'Animation', value: 'animation' },
                      { text: 'Adventure', value: 'adventure' },
                      { text: 'Fantasy', value: 'fantasy' },
                      { text: 'Biography', value: 'biography' },
                      { text: 'War', value: 'war' },
                      { text: 'News', value: 'news' },
                      { text: 'Music', value: 'music' },
                      { text: 'Musical', value: 'musical' },
                      { text: 'Reality Tv', value: 'reality-tv' },
                      { text: 'Western', value: 'western' },
                      { text: 'Sport', value: 'sport' },
                      { text: 'Documentary', value: 'documentary' },
                      { text: 'History', value: 'history' },
                      ]"
            />
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn color="green" @click="search(true)" :disabled="loading">
              Search
              <v-icon right>fas fa-search</v-icon>
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
      <v-layout row wrap v-if="movies">
        <v-flex xs12 sm4 md3 xl2 v-for="movie in movies" :key="movie.id" class="pa-3 double-ms">
          <movie-card :movie="movie" />
        </v-flex>
      </v-layout>
      <v-flex class="text-xs-center" v-else>
        <h1 class="title">No Results.</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MovieCard from "../../components/MovieCard";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    MovieCard
  },
  data() {
    return {
      query: "",
      rating: 0,
      limit: 20,
      order: "desc",
      sort: "date_added",
      genre: "all",
      loading: false,
      errors: "",
      cpage: 1,
      generatedPages: []
    };
  },
  methods: {
    ...mapActions(["loadMoviesList"]),
    readStorage(key) {
      const value = sessionStorage.getItem(key);
      return value !== null ? value : undefined;
    },
    search(resetPages = false, defaultSearch = false) {
      if (resetPages) this.cpage = 1;

      const params = {
        query_term: this.query,
        minimum_rating: (this.rating * 10) / 5,
        limit: this.limit,
        order_by: this.order,
        sort_by: this.sort,
        genre: this.genre,
        page: this.cpage
      };

      this.loading = true;
      this.loadMoviesList(defaultSearch ? {} : params)
        .catch(err => {
          console.error(err);
          this.errors = err.message;
        })
        .finally(() => (this.loading = false));
    },
    clearResults() {}
  },
  watch: {
    cpage() {
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
    }
  },
  computed: {
    ...mapGetters(["page", "pages", "movies"])
  },
  created() {
    document.title = "Live Torrent - Movies";

    this.search(true, true);
  }
};
</script>

<style lang="scss" scoped>
.double-ms {
  @media only screen and (min-width: 400px) and (max-width: 799px) {
    max-width: 50%;
  }
}
</style>
