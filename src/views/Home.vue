<template>
  <v-layout align-center justify-center fill-height>
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
            v-model="torrentId"
            label="Torrent ID -> http/https url, magnet uri, info hash"
            @keydown.enter="loadInfo"
            :error-messages="errors"
            :disabled="loading"
            solo
            light
            :loading="loading"
            persistent-hint
            hint="torrentID can be torrent magnet uri, torrent HTTP/HTTPS url or torrent info hash"
            clearable
            autofocus
          />
          <div class="text-xs-center text-md-right mt-4">
            <v-btn color="success" :disabled="loading" @click="loadDemo">Demo</v-btn>
            <v-btn color="info" @click="loadInfo" :loading="loading" :disabled="loading">Explore</v-btn>
          </div>
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
      torrentId: "",
      errors: ""
    };
  },
  methods: {
    ...mapActions(["loadTorrentInfo"]),
    loadInfo() {
      this.loading = true;
      this.errors = "";

      const validation = this.validateInput();
      if (!validation.isValid) {
        if (validation.isEmpty) this.errors = "Please enter torrent ID";
        else this.errors = "Invalid torrent ID";

        this.loading = false;
        return;
      }

      this.loadTorrentInfo(this.torrentId)
        .then(res => {
          this.$router.push({
            name: "explorer",
            query: {
              torrentId: this.$store.state.torrentInfo.infoHash
            }
          });
        })
        .catch(err => {
          this.errors = "Can not access the server right now, Try again later!";
          console.error(err);
        })
        .finally(() => (this.loading = false));
    },
    loadDemo() {
      this.torrentId =
        "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel";
    },
    validateInput() {
      const input = this.torrentId.trim();

      const isEmpty = input === "";
      const isMagnet = input.match(
        /^magnet:\?xt=urn:[a-z0-9]+:[a-f0-9]{40}(&[a-z0-9]+=[a-z0-9]+)*$/i
      );
      const isInfoHash = input.match(/[a-f0-9]{32}/i);
      const isTorrentFile = input.match(/^https?:\/\/.+\.torrent$/i);

      const isValid = !isEmpty && (isMagnet || isInfoHash || isTorrentFile);

      return {
        isValid,
        isMagnet,
        isInfoHash,
        isTorrentFile,
        isEmpty
      };
    }
  },
  created() {
    const { q } = this.$route.params;
    if (q) this.torrentId = q;
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
