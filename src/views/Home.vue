<template>
  <v-layout align-center justify-center fill-height>
    <div ref="feedback"></div>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs12 mb-5>
          <h1
            class="text-xs-center text-uppercase font-weight-black"
            :class="[
              { 'display-2': $vuetify.breakpoint.mdAndUp },
              { 'display-1': $vuetify.breakpoint.smOnly }
            ]"
          >
            <span style="color: #d21414">
              <i class="fas fa-circle logo"></i>
              Live
            </span> Torrent
          </h1>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-text-field
            v-model="query"
            label="Looking for something or you have a torrentID"
            @keydown.enter="search"
            :error-messages="errors"
            :disabled="loading"
            solo
            light
            :loading="loading"
            persistent-hint
            hint="torrentID can be torrent magnet, torrent HTTP/HTTPS url or torrent info hash"
            clearable
            :autofocus="!$vuetify.breakpoint.xsOnly"
          />
          <div class="text-xs-center text-md-right mt-4">
            <v-btn color="success" :disabled="loading" @click="loadDemo">Demo</v-btn>
            <v-btn color="info" @click="search" :loading="loading" :disabled="loading">
              {{
              validateQuery.isTorrentId ? "Explore" : "Search"
              }}
            </v-btn>
          </div>
        </v-flex>
        <v-flex xs10 offset-xs1 class="mt-5">
          <div class="mb-3">Share Live Torrent:</div>
          <social-sharing
            :url="hostURL"
            title="Explore, download or watch torrent files online"
            description="Live Torrent is a web app to explore, download or watch torrent files online"
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
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "home",
  data() {
    return {
      loading: false,
      query: "",
      errors: ""
    };
  },
  methods: {
    ...mapActions(["loadTorrentInfo"]),
    search() {
      this.loading = true;
      this.errors = "";

      const validation = this.validateQuery;
      if (validation.isEmpty) {
        this.errors = "Please enter torrent ID or Search Query";
        this.loading = false;
      } else if (validation.isTorrentId) {
        this.$router.push({
          name: "explorer",
          query: {
            torrentId: this.query
          }
        });
      } else {
        this.$router.push({
          name: "search",
          query: {
            query: this.query
          }
        });
      }
    },
    loadDemo() {
      this.query =
        "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel";
    }
  },
  computed: {
    validateQuery() {
      const query = this.query.trim();

      const isEmpty = query === "";
      const isMagnet = query.match(
        /^magnet:\?xt=urn:[a-z0-9]+:[a-f0-9]{40}(&[a-z0-9]+=[a-z0-9]+)*$/i
      );
      const isInfoHash = query.match(/[a-f0-9]{32}/i);
      const isTorrentFile = query.match(/^https?:\/\/.+\.torrent$/i);

      const isTorrentId = !isEmpty && (isMagnet || isInfoHash || isTorrentFile);

      const isSearchQuery = !isEmpty && !isTorrentId;

      return {
        isTorrentId,
        isMagnet,
        isInfoHash,
        isTorrentFile,
        isSearchQuery,
        isEmpty
      };
    }
  },
  created() {
    const { query } = this.$route.query;
    if (query) {
      this.query = query;
      this.search();
    }

    document.title = "Live Torrent";
  },
  mounted() {
    const tag = document.createElement("script");
    tag.src = [
      "https:" === location.protocol ? "https://" : "http://",
      "widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgdyvFhC7sq8eqCvG9QaH9oQuDYDFvXYG3OXspPZvZQC2E.js"
    ].join("");
    tag.type = "text/javascript";
    tag.id = "smcx-sdk";
    tag.async = true;
    this.$refs.feedback.appendChild(tag);
  }
};
</script>

<style scoped>
.v-messages {
  color: #eee !important;
}

.logo {
  animation: fade-in-out 2s ease-in-out infinite;
}

@keyframes fade-in-out {
  0% {
    opacity: 1;
  }
  10% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  90% {
    opacity: 1;
  }
}
</style>
