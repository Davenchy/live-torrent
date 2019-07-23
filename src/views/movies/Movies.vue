<template>
  <v-container fluid fill-height>
    <v-layout raw wrap xs12 v-if="movies">
      <v-flex xs12 class="my-5 text-xs-center">
        <h1>Torrent Movies</h1>
      </v-flex>
      <v-flex xs12 sm4 md3 xl2 v-for="movie in movies" :key="movie.id" class="pa-3 double-ms">
        <movie-card :movie="movie" />
      </v-flex>
    </v-layout>
    <v-layout v-else justify-center align-center fill-height>
      <v-flex class="text-xs-center">
        <v-progress-circular :size="100" :width="10" color="primary" indeterminate></v-progress-circular>
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
      loading: false,
      errors: ""
    };
  },
  methods: {
    ...mapActions(["loadMoviesList"]),
    search() {}
  },
  computed: {
    ...mapGetters(["page", "pages", "movies"])
  },
  created() {
    document.title = "Live Torrent - Movies";

    this.loading = true;
    this.loadMoviesList({})
      .catch(err => {
        console.error(err);
        this.errors = err.message;
      })
      .finally(() => (this.loading = false));
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
