<template>
  <v-layout fill-height justify-center align-center v-if="torrentInfo && fileIndex">
    <v-flex xs12 sm10 offset-sm>
      <v-card>
        <v-card-title>{{ file.name }} - {{ file.size | size }} - Peers {{ torrentInfo.peers }}</v-card-title>
        <v-card-text>
          <video id="player" :src="`/api/stream/${torrentInfo.infoHash}/${fileIndex}`" controls></video>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
  <v-layout v-else justify-center align-center fill-height>
    <v-flex xs1 offset-xs>
      <v-progress-circular :size="100" :width="10" color="primary" indeterminate></v-progress-circular>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import sizeFilter from "../mixins/sizeFilter";

export default {
  name: "player",
  data() {
    return {
      fileIndex: null
    };
  },
  mixins: [sizeFilter],
  methods: {
    ...mapActions(["loadTorrentInfo"]),
    checkIndex() {
      const { fileIndex, $router, torrentInfo } = this;

      if (!fileIndex) {
        $router.push({
          name: "explorer",
          query: {
            torrentId: torrentInfo.infoHash
          }
        });
      } else this.setPlayer();
    },
    setPlayer() {
      const controls = [
        "play-large", // The large play button in the center
        "rewind", // Rewind by the seek time (default 10 seconds)
        "play", // Play/pause playback
        "fast-forward", // Fast forward by the seek time (default 10 seconds)
        "progress", // The progress bar and scrubber for playback and buffering
        "current-time", // The current time of playback
        "duration", // The full duration of the media
        "mute", // Toggle mute
        "volume", // Volume control
        "captions", // Toggle captions
        "settings", // Settings menu
        "fullscreen" // Toggle fullscreen
      ];

      const player = new this.$Plyr("#player", {
        controls
      });

      // player.touch = true;
    }
  },
  computed: {
    ...mapState(["torrentInfo"]),
    file() {
      return this.torrentInfo.files[this.fileIndex];
    }
  },
  created() {
    const id = this.$route.query.torrentId;
    this.fileIndex = this.$route.query.fileIndex;

    if (!this.torrentInfo) {
      if (!id) this.$router.push({ name: "home" });
      else {
        this.loadTorrentInfo(id)
          .then(() => this.checkIndex())
          .catch(err => {
            console.error(err);
            this.$router.push({ name: "home" });
          });
      }
    } else this.checkIndex();
  }
};
</script>

<style scoped>
video {
  max-width: 100%;
  max-height: 100%;
}
</style>
