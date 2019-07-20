<template>
  <v-layout fill-height justify-center align-center v-if="torrentInfo && fileIndex">
    <v-flex xs12 sm10 offset-sm>
      <v-card>
        <v-card-title>{{ file.name }} - {{ file.size | size }} - Peers {{ torrentInfo.peers }}</v-card-title>
        <v-card-text>
          <video
            id="player"
            ref="player"
            :src="`/api/stream/${torrentInfo.infoHash}/${fileIndex}`"
            controls
          >
            <track
              v-for="(c, i) in captions"
              :key="i"
              kind="captions"
              :label="c.label"
              :src="c.url"
            />
          </video>

          <v-text-field label="Share Video" readonly prepend-icon="share" :value="shareURL" />
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
      fileIndex: null,
      captions: []
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
      } else {
        this.$nextTick(() => this.setPlayer());
      }
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

      try {
        const player = new this.$Plyr(this.$refs.player, {
          controls
        });
        player.touch = true;
      } catch (err) {
        console.error(err);
      }
    }
  },
  computed: {
    ...mapState(["torrentInfo"]),
    file() {
      return this.torrentInfo.files[this.fileIndex];
    },
    shareURL() {
      const { hostURL, torrentInfo, file, captions } = this;
      return `${hostURL}/player?torrentId=${torrentInfo.infoHash}&fileIndex=${
        file.index
      }${captions.map(c => `&${c.label}::${c.url}`)}`;
    }
  },
  mounted() {
    const { torrentId, fileIndex, caption, captionName } = this.$route.query;
    const id = torrentId;
    this.fileIndex = fileIndex;
    let captions = [];

    if (Array.isArray(caption)) captions = caption;
    else captions = [caption];

    const srt2vtt = l => `${this.hostURL}/api/srt2vtt?path=${l}`;

    captions.forEach(c => {
      const cInfo = c.split("::");
      const len = cInfo.length;

      if (len === 1)
        this.captions.push({
          url: srt2vtt(cInfo[0]),
          label: "Unamed Caption"
        });
      else if (len === 2)
        this.captions.push({
          url: srt2vtt(cInfo[1]),
          label: cInfo[0] || "Unamed Caption"
        });
    });

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
