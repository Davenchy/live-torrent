<template>
  <v-container fluid fill-height>
    <v-layout raw wrap v-if="movie">
      <v-flex xs12 class="my-5 text-xs-center">
        <h1>{{ movie.title }}</h1>
      </v-flex>
      <v-flex xs12 sm6 md5 lg3 offset-lg1>
        <v-img
          :src="movie.large_cover_image"
          :lazy-src="movie.small_cover_image"
          min-height="400px"
        >
          <template v-slot:placeholder>
            <v-layout fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="blue"></v-progress-circular>
            </v-layout>
          </template>
        </v-img>
      </v-flex>
      <v-flex xs12 :mt-5="$vuetify.breakpoint.xsOnly" sm6 md5 offset-md2>
        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
          :value="0"
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-info-circle</v-icon>Information
              </div>
            </template>
            <v-card>
              <v-card-text>
                <div>Language: {{ movie.language }}</div>
                <div>MPA Rating: {{ movie.mpa_rating || 'Unknown' }}</div>
                <div>IMDB Code: {{ movie.imdb_code }}</div>
                <div>Year: {{ movie.year }}</div>
                <div>Rating: {{ movie.rating }}</div>
                <div>
                  Genres:
                  <span v-for="(g, i) in movie.genres" :key="i" class="mx-1">{{ g }}</span>
                </div>
                <div>Watching: {{ movie.runtime }}</div>
                <div>Downloads: {{ movie.download_count }}</div>
                <div>Uploaded At: {{ movie.date_uploaded }}</div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-align-left</v-icon>Description
              </div>
            </template>
            <v-card>
              <v-card-text>{{ movie.description_full }}</v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-mask</v-icon>Casts
              </div>
            </template>
            <v-card>
              <v-card-text>
                <v-list two-line>
                  <v-list-tile v-for="cast in movie.cast" :key="cast.imdb_code" avatar>
                    <v-list-tile-avatar>
                      <img :src="cast.url_small_image" v-if="cast.url_small_image" />
                      <v-icon v-else>fas fa-user-alt</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ cast.name }} - IMDB Code: {{ cast.imdb_code }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ cast.character_name }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-film</v-icon>YTS
              </div>
            </template>
            <v-card>
              <v-card-text>
                <div>Trailer Code: {{ movie.yt_trailer_code }}</div>
                <div>
                  Visit movie on yts from
                  <a :href="movie.url" target="blank">here</a>.
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-share-alt</v-icon>Share
              </div>
            </template>
            <v-card>
              <v-card-text>
                <social-sharing
                  :title="`Watch for free '${movie.title_long}' movie`"
                  :description="`Watch for free '${movie.title_long}' movie`"
                  hashtags="live_torrent"
                  twitter-user="fadi_davenchy"
                  network-tag="a"
                  inline-template
                >
                  <div>
                    <network network="facebook" class="blue--text text--darken-2 ma-3">
                      <i class="fab fa-facebook"></i> Facebook
                    </network>
                    <network network="reddit" class="red--text text--lighten-1 ma-3">
                      <i class="fab fa-reddit-alien"></i> Reddit
                    </network>
                    <network network="twitter" class="blue--text text--lighten-4 ma-3">
                      <i class="fab fa-twitter"></i> Twitter
                    </network>
                    <network network="telegram" class="blue--text text--lighten-2 ma-3">
                      <i class="fab fa-telegram"></i> Telegram
                    </network>
                    <network network="skype" class="blue--text ma-3">
                      <i class="fab fa-skype"></i> Skype
                    </network>
                    <network network="sms" class="yellow--text ma-3">
                      <i class="fas fa-sms"></i> SMS
                    </network>
                    <network network="email" class="orange--text ma-3">
                      <i class="fas fa-envelope"></i> Email
                    </network>
                    <network network="vk" class="blue--text text--darken-3 ma-3">
                      <i class="fab fa-vk"></i> VKontakte
                    </network>
                    <network network="weibo" class="red--text text--darken-1 ma-3">
                      <i class="fab fa-weibo"></i> Weibo
                    </network>
                    <network network="whatsapp" class="green--text text--lighten-2 ma-3">
                      <i class="fab fa-fw fa-whatsapp"></i> Whatsapp
                    </network>
                  </div>
                </social-sharing>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>

      <v-flex xs12 mt-5>
        <h1 class="title mb-4">Screenshots:</h1>
        <v-carousel>
          <v-carousel-item :src="movie.large_screenshot_image1"></v-carousel-item>
          <v-carousel-item :src="movie.large_screenshot_image2"></v-carousel-item>
          <v-carousel-item :src="movie.large_screenshot_image3"></v-carousel-item>
        </v-carousel>
      </v-flex>

      <v-flex xs12 mt-5>
        <h1 class="subheading">Torrents:</h1>

        <v-layout raw wrap>
          <v-flex xs12 md6 xl4 v-for="torrent in movie.torrents" :key="torrent.hash">
            <v-card dark color="#445064" class="ma-2">
              <v-card-title class="title">
                {{ torrent.type }} - {{ torrent.quality }} - {{ torrent.size }} -
                <span
                  class="subheading grey--text ml-1"
                >{{ torrent.date_uploaded }}</span>
              </v-card-title>

              <v-card-text>
                Seeds/Peers: {{ torrent.seeds }}/{{ torrent.peers }}
                <v-text-field label="Hash" :value="torrent.hash" readonly />

                <v-btn color="green" tag="a" :href="torrent.url">Download (.torrent)</v-btn>
                <v-btn
                  color="purple"
                  tag="a"
                  :href="`${hostURL}/player?torrentId=${torrent.hash}`"
                >Watch</v-btn>
                <v-btn
                  color="blue"
                  tag="a"
                  :href="`${hostURL}/explorer?torrentId=${torrent.hash}`"
                >Explore</v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 mt-5 v-if="movie.suggestedMovies">
        <h1 class="subheading">Suggested Movies:</h1>

        <v-layout raw wrap mt-5>
          <v-flex
            xs6
            sm4
            md3
            lg3
            xl4
            v-for="suggestedMovie in movie.suggestedMovies"
            :key="suggestedMovie.id"
            class="pa-2 pb-4"
          >
            <movie-card :movie="suggestedMovie" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import MovieCard from "../../components/MovieCard";

export default {
  name: "movie",
  components: {
    MovieCard
  },
  data() {
    return {
      movie: null
    };
  },
  methods: {
    ...mapActions(["loadMoviePage"])
  },
  watch: {
    movie(n) {
      document.title = "Live Torrent - Movie - " + n.title_long;
    }
  },
  created() {
    const { id } = this.$route.params;

    this.loadMoviePage(id)
      .then(movie => (this.movie = movie))
      .catch(err => console.error(err));
  }
};
</script>