<template>
  <v-layout fill-height justify-center align-center v-if="file">
    <v-flex xs12 sm10 offset-sm my-5>
      <v-card color="#445064">
        <v-card-title>{{ file.name }} - {{ file.size | size }} - Peers {{ torrentInfo.peers }}</v-card-title>
        <v-card-text>
          <h1 class="subheading">Share:</h1>

          <v-text-field
            label="Share Video"
            class="mt-2"
            readonly
            prepend-icon="share"
            :value="shareURL"
          />

          <social-sharing
            :url="shareURL"
            :title="`Watch this video '${file.name}'`"
            :description="`Watch this video '${file.name}'`"
            hashtags="live-torrent"
            twitter-user="fadi_davenchy"
            network-tag="a"
            class="mt-2 mb-5"
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
      const ready = () => {
        this.$nextTick(() => this.setPlayer());
        document.title = "Live Torrent - video player - " + this.file.name;
      };

      if (!fileIndex) {
        // try to get playlist for future updates
        const playlist = torrentInfo.files.filter(
          f => f.type.startsWith("video") || f.type.startsWith("audio")
        );

        if (playlist.length > 0) {
          this.fileIndex = playlist[0].index;
          ready();
        } else {
          $router.push({
            name: "explorer",
            query: {
              torrentId: torrentInfo.infoHash
            }
          });
        }
      } else ready();
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
        const player = new window.Plyr(this.$refs.player, {
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
      const { torrentInfo } = this;
      return torrentInfo ? torrentInfo.files[this.fileIndex] : null;
    },
    shareURL() {
      const { hostURL, torrentInfo, file, captions } = this;
      return `${hostURL}/player?torrentId=${torrentInfo.infoHash}&fileIndex=${
        file.index
      }${captions.map(c => `&${c.label}::${c.url}`)}`;
    }
  },
  mounted() {
    const self = this;
    const { torrentId, fileIndex, caption } = this.$route.query;
    const id = torrentId;
    this.fileIndex = fileIndex;
    let captions = [];
    let label = "Unamed Caption";
    let url = "";
    let type = "url";

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

    if (Array.isArray(caption)) captions = caption;
    else captions = [caption];

    const srt2vtt = l => `${this.hostURL}/api/srt2vtt?path=${l}`;

    captions
      .filter(a => a)
      .forEach(async function(c) {
        const cInfo = c.split("::");
        const len = cInfo.length;

        if (len === 1) {
          url = srt2vtt(cInfo[0]);
        } else if (len === 2) {
          label = cInfo[0] || label;
          url = srt2vtt(cInfo[1]);
        } else if (len === 3) {
          label = cInfo[0] || label;
          type = cInfo[1];
          const data = cInfo[2];

          if (!data || !type) return;

          if (type === "text") {
            try {
              const res = await backend.post("/srt2vtt", { srt: data });
              const blob = new Blob([res.data.trim()], { type: "text/vtt" });
              url = URL.createObjectURL(blob);
              console.log("ready");
            } catch (err) {
              console.error(err);
            }
          } else if (type === "zip") {
          } else if (type === "os") {
          } else if (type === "imdb") {
          }
        }

        if (!url) return;
        self.captions.push({ label, url, type });
      });
  }
};
</script>

<style scoped>
video {
  max-width: 100%;
  max-height: 100%;
}
</style>
