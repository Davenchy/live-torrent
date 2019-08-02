<template>
  <a :href="movieURL" style="text-decoration: none">
    <v-hover light>
      <v-card light :class="`elevation-${hover ? 24 : 2}`" slot-scope="{ hover }">
        <v-img
          :src="movie.medium_cover_image"
          :lazy-src="movie.small_cover_image"
          :alt="movie.title + '\'s poster'"
          min-height="200px"
          class="black--text text--lighten-2"
        >
          <template v-slot:placeholder>
            <v-layout fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="blue"></v-progress-circular>
            </v-layout>
          </template>

          <v-card-text>
            <v-layout row>
              <v-flex xs6>
                <bookmark-button
                  class="prevent-click"
                  :bookmarkInfo="{
                    name: `${movie.title} (${movie.year}) - Movie Page`,
                    id: `movie::${movie.imdb_code}`,
                    url: `${hostURL}/movies/${movie.id}`
                  }"
                  @mouseenter.native="hovered = true"
                  @mouseleave.native="hovered = false"
                />
              </v-flex>
              <v-flex
                class="text-xs-right"
                xs6
                offset-xs6
                v-if="movie.year === new Date().getUTCFullYear()"
              >
                <v-chip color="red" dark>New</v-chip>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-img>
      </v-card>
    </v-hover>
    <div class="text-xs-center white--text text--darken-4 my-2 title">
      <div>{{ movie.title }} - {{ movie.year }}</div>
      <div>
        <v-rating :value="5 * movie.rating / 10" half-increments color="yellow" readonly></v-rating>
      </div>
    </div>
  </a>
</template>

<script>
import BookmarkButton from "./BookmarkButton";

export default {
  components: {
    BookmarkButton
  },
  props: {
    movie: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      hovered: false
    };
  },
  computed: {
    movieURL() {
      const { hovered, hostURL, movie } = this;
      if (!hovered) return `${hostURL}/movies/${movie.id}`;
      return "javascript:void(0)";
    }
  }
};
</script>
