<template>
  <v-layout fill-height justify-center align-center v-if="file">
    <v-flex xs12 sm10 offset-sm my-5>
      <v-card color="#445064">
        <v-card-title>
          {{ file.name }} - {{ file.size | size }} - Peers {{ torrentInfo.peers }}
          <bookmark-button
            v-if="file"
            :bookmarkInfo="{
            name: `${file.name} - Video Player`,
            id: 'player::' + torrentInfo.infoHash + '::' + file.path,
            url: shareURL
          }"
          />
          <v-btn icon color="green" @click="refresh">
            <v-icon>fas fa-sync {{ spin ? 'fa-spin' : '' }}</v-icon>
          </v-btn>
          <v-btn color="blue" @click="$router.push('/explorer')">Back To Explorer</v-btn>
          <v-btn
            icon
            tag="a"
            target="_blank"
            :href="`/api/stream/${torrentInfo.infoHash}/${file.index}`"
            :download="file.name"
          >
            <v-icon color="green darken-2">fas fa-download</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-expansion-panel popout dark class="mb-5">
            <v-expansion-panel-content style="background: #20252c !important">
              <template v-slot:header>
                <div class="title">
                  <v-icon left>fas fa-share-alt</v-icon>Share
                </div>
              </template>
              <v-card color="#2b313b">
                <v-card-text>
                  <v-text-field
                    label="Share Video"
                    class="mt-2"
                    readonly
                    prepend-icon="share"
                    :value="shareURL"
                  >
                    <template v-slot:append>
                      <v-btn icon @click="$clipboard.copy(shareURL)">
                        <v-icon small>fas fa-copy</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>

                  <social-sharing
                    :url="shareURL"
                    :title="`Watch this video '${file.name}'`"
                    :description="`Watch this video '${file.name}'`"
                    hashtags="live_torrent"
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
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-alert
            v-model="captionsError"
            dismissible
            transition="scale-transition"
            type="error"
            class="white--text"
            light
          >Failed to download captions.</v-alert>
          <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
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
              :srclang="c.lang || false"
            />
          </video>

          <v-expansion-panel popout dark class="my-5">
            <v-expansion-panel-content style="background: #20252c !important">
              <template v-slot:header>
                <div class="title">
                  <v-icon left>fas fa-closed-captioning</v-icon>Captions Options
                </div>
              </template>
              <v-card color="#2b313b">
                <v-card-text class="text-xs-center">
                  <v-flex class="my-4">
                    <h1 class="title mb-3">Caption Size [ {{ captionsFontSize }} ]</h1>
                    <v-btn color="green" @click="adjustCaptionsSize(1)">
                      <v-icon left small>fas fa-search-plus</v-icon>Increase
                    </v-btn>
                    <v-btn color="red" @click="adjustCaptionsSize(-1)">
                      <v-icon left small>fas fa-search-minus</v-icon>Decrease
                    </v-btn>
                  </v-flex>
                  <v-flex class="my-4">
                    <h1 class="title mb-3">Upload Caption</h1>
                    <input
                      type="file"
                      placeholder="Upload Caption"
                      @change="uploadCaption"
                      accept=".vtt, .srt"
                    />
                  </v-flex>
                  <v-flex class="my-4">
                    <h1 class="title mb-3">Load URL Caption</h1>
                    <v-text-field type="url" label="Load Caption" v-model="loadCaptionInfo">
                      <template v-slot:append>
                        <div>
                          <v-btn @click="loadCaption" color="blue">Load</v-btn>
                        </div>
                      </template>
                    </v-text-field>
                  </v-flex>
                  <v-flex class="my-4" v-if="player && captions.length">
                    <h1 class="title mb-3">Fix caption timing</h1>
                    <v-text-field
                      label="Caption Delay"
                      type="number"
                      v-model="captionDelay"
                      min="0"
                      :max="player.duration"
                    />
                    <v-btn color="blue" @click="timeA = player.currentTime">Caption appears here</v-btn>
                    <v-btn
                      color="blue"
                      @click="timeB = player.currentTime"
                    >Caption should appears here</v-btn>
                    <br />
                    <v-btn
                      color="green"
                      @click="captionDelay += parseFloat(timeB - timeA)"
                    >Fix Caption Timing</v-btn>
                  </v-flex>
                  <v-flex v-if="captions.length">
                    <h1 class="title">Loaded Captions</h1>
                    <div v-for="(c, i) in captions" :key="i">
                      <a
                        :href="c.url"
                        :download="c.label"
                        target="_blank"
                      >{{c.label}} - {{c.lang || 'unknown lang'}}</a>
                      <v-btn icon @click="captions.splice(i, 1)">
                        <v-icon small color="red">fas fa-trash</v-icon>
                      </v-btn>
                    </div>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
  <v-layout v-else justify-center align-center fill-height>
    <v-flex class="text-xs-center">
      <v-progress-circular :size="100" :width="10" color="primary" indeterminate></v-progress-circular>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";
import sizeFilter from "../mixins/sizeFilter";
import Captions, { loadText, loadURL } from "../utils/captions";
import BookmarkButton from "../components/BookmarkButton";

export default {
  name: "player",
  components: {
    BookmarkButton
  },
  data() {
    return {
      player: null,
      spin: false,
      fileIndex: null,
      timeA: 0,
      timeB: 0,
      captionDelay: 0,
      loading: false,
      captionsError: false,
      captions: [],
      loadCaptionInfo: "",
      captionsFontSize: 18
    };
  },
  mixins: [sizeFilter],
  watch: {
    captionDelay(delay) {
      const node = this.player.captions.currentTrackNode;
      if (!node) return;
      const len = node.cues.length;
      delay = parseFloat(delay) || 0;

      for (let i = 0; i < len; i++) {
        for (let id = 1; id <= len; id++) {
          const cue = node.cues[i];
          if (cue.id === "" + id) {
            cue.startTimeTemp = cue.startTimeTemp || cue.startTime || 0;
            cue.endTimeTemp = cue.endTimeTemp || cue.endTime || 0;

            cue.startTime = cue.startTimeTemp + delay;
            cue.endTime = cue.endTimeTemp + delay;
          }
        }
      }
    }
  },
  methods: {
    ...mapActions(["loadTorrentInfo"]),
    loadCaption() {
      loadURL({
        label: prompt("Caption Name:", "Unknown") || "Unknown",
        lang: prompt("Caption Language short code:", "en") || "",
        type: "url",
        originalData: this.loadCaptionInfo,
        encoding: prompt("Caption Encoding:", "utf8") || null,
        data: this.loadCaptionInfo
      })
        .then(caption => this.captions.push(caption))
        .catch(err => {
          console.error(err);
          alert(err.message);
        });
    },
    uploadCaption(e) {
      const files = e.target.files;
      if (!files.length) return;
      const file = files[0];
      if (file.type !== "application/x-subrip" && file.type !== "text/vtt")
        return alert("Only .vtt and .srt subtitles are supported");
      if (window.File && window.FileReader && window.FileList && window.Blob) {
        const reader = new FileReader();
        reader.onload = data => {
          loadText({
            label: file.name,
            type: "text",
            lang: prompt("Caption Language short code:", "en") || "",
            encoding: prompt("Caption Encoding:", "utf8") || null,
            originalData: data.target.result,
            data: data.target.result
          }).then(caption => this.captions.push(caption));
        };
        reader.readAsText(file);
      } else {
        alert("The File APIs are not fully supported in this browser.");
      }
    },
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
        "pip", // Picture-in-picture (currently Safari only)
        "airplay", // Airplay (currently Safari only)
        "fullscreen" // Toggle fullscreen
      ];

      try {
        const player = new window.Plyr(this.$refs.player, {
          captions: {
            active: true,
            update: true
          },
          controls
        });
        this.player = player;

        // pause the video on click
        // more info https://github.com/sampotts/plyr/issues/718#issuecomment-451906473
        const { wrapper, container } = player.elements;
        if (!container._clickListener) {
          container._clickListener = event => {
            const targets = [container, wrapper];

            // Ignore if click if not container or in video wrapper
            if (
              !targets.includes(event.target) &&
              !wrapper.contains(event.target)
            ) {
              return;
            }

            if (player.touch) player.togglePlay();
          };
          container.addEventListener("click", container._clickListener);
        }
        // end
      } catch (err) {
        console.error(err);
      }
    },
    refresh() {
      const { torrentInfo, loadTorrentInfo, $router } = this;
      this.spin = true;
      loadTorrentInfo(torrentInfo.infoHash)
        .catch(err => {
          console.error(err);
          $router.push({ name: "home" });
        })
        .finally(() => {
          setTimeout(() => (this.spin = false), 1000);
        });
    },
    adjustCaptionsSize(value) {
      const captionsElement = document.querySelector(".plyr__captions");
      if (!captionsElement) return;
      const currentSize =
        parseInt(window.getComputedStyle(captionsElement).fontSize) || 18;
      if (value < 0 && currentSize <= 5) return;
      this.captionsFontSize = currentSize + value;
      captionsElement.style.fontSize = `${this.captionsFontSize}px`;
    }
  },
  computed: {
    ...mapState(["torrentInfo"]),
    file() {
      const { torrentInfo } = this;
      return torrentInfo ? torrentInfo.files[this.fileIndex] : null;
    },
    shareURL() {
      const { hostURL, torrentInfo, file } = this;

      let captions =
        this.captions
          .map(c => {
            if (c.type === "imdbid") return;
            return `&caption=${c.type}::${c.label || ""}::${c.lang || ""}::${
              c.encoding
            }::${c.originalData}`;
          })
          .join("") || "";

      const imdbidCaption = this.captions.find(c => c.type === "imdbid");
      if (imdbidCaption)
        captions += `&caption=imdbid::${imdbidCaption.originalData}`;

      return `${hostURL}/player?torrentId=${torrentInfo.infoHash}&fileIndex=${file.index}${captions}`;
    }
  },
  mounted() {
    const { torrentId, fileIndex } = this.$route.query;
    const id = torrentId;
    this.fileIndex = fileIndex;

    // load video from torrent file
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

    // load captions for the video
    this.loading = true;
    Captions(this.$route.query)
      .then(captions => {
        this.captions = captions.filter(a => a); // remove broken captions
      })
      .catch(err => {
        console.error(err);
        this.captionsError = true;
      })
      .finally(() => (this.loading = false));
  }
};
</script>

<style scoped>
video {
  max-width: 100%;
  max-height: 100%;
}
</style>
