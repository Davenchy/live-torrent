<template>
  <v-container fluid mt-5 v-if="torrentInfo">
    <v-layout row>
      <v-flex xs12 md8 offset-md2>
        <v-card color="#445064">
          <v-sheet class="pa-3" color="#445064">
            <div class="title mb-3">
              {{ torrentInfo.name }} - {{ torrentInfo.size | size }} - Peers:
              {{ torrentInfo.peers }}
              <bookmark-button
                v-if="torrentInfo"
                :bookmarkInfo="{
                  name: `${torrentInfo.name} - Explorer Page`,
                  id: 'explorer::' + torrentInfo.infoHash,
                  url: shareURL
                }"
              />
              <v-btn icon color="green" @click="reload">
                <v-icon>fas fa-sync {{ spin ? "fa-spin" : "" }}</v-icon>
              </v-btn>
            </div>

            <v-text-field
              readonly
              flat
              label="Info Hash"
              :value="torrentInfo.infoHash"
              prepend-icon="info"
              color="blue"
            >
              <template v-slot:append>
                <v-btn icon @click="$copy(torrentInfo.infoHash)">
                  <v-icon small>fas fa-copy</v-icon>
                </v-btn>
              </template>
            </v-text-field>

            <v-text-field
              color="green"
              readonly
              flat
              label="Share Link"
              :value="shareURL"
              prepend-icon="share"
            >
              <template v-slot:append>
                <v-btn icon @click="$copy(shareURL)">
                  <v-icon small>fas fa-copy</v-icon>
                </v-btn>
              </template>
            </v-text-field>

            <share-buttons
              :url="shareURL"
              :title="`Explore '${torrentInfo.name}' torrent file`"
              desc="Explore this torrent file"
            />

            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn color="blue" class="right" dark v-on="on">
                  Download
                  <v-icon dark right>arrow_drop_down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-tile
                  v-for="(item, index) in torrentDownloadLinks"
                  :key="index"
                  tag="a"
                  target="_blank"
                  :href="item.link"
                  :download="item.title"
                >
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>

            <div class="clearfix"></div>

            <div class="mt-3 subheading">Files:</div>

            <v-text-field
              placeholder="looking for something..."
              v-model="search"
              clearable
              transition
            />
          </v-sheet>
          <v-card-text>
            <v-treeview
              v-model="tree"
              :items="filesTree"
              :filter="filter"
              :search="search"
              :open="[0]"
              open-on-click
              style="max-width: 100%; overflow: auto;"
            >
              <template v-slot:label="{ item, open }">
                <div :title="item.name">
                  <a
                    v-if="item.type !== 'folder'"
                    :href="
                      `/api/torrent/serve/${
                        torrentInfo.infoHash
                      }/${item.path.substr(1) || item.index}`
                    "
                    target="_blank"
                    class="text-truncate wrap"
                    >{{ item.name }}&nbsp;
                  </a>
                  <span v-else>{{ item.name }}</span>
                  <span v-if="item.type !== 'folder'" class="green--text">
                    - {{ item.size | size }}
                  </span>
                </div>
              </template>
              <template v-slot:prepend="{ item, open }">
                <i
                  v-if="item.type === 'folder'"
                  :class="
                    `fas fa-${
                      open
                        ? 'folder-open text--lighten-2'
                        : 'folder text--darken-2'
                    } blue--text`
                  "
                ></i>
                <i
                  v-else-if="item.type.startsWith('video')"
                  class="fas fa-video purple--text text--lighten-1"
                ></i>
                <i
                  v-else-if="item.type.startsWith('image')"
                  class="fas fa-image green--text text--lighten-1"
                ></i>
                <i
                  v-else-if="item.type.startsWith('audio')"
                  class="fas fa-image orange--text text--lighten-1"
                ></i>
                <i
                  v-else-if="
                    item.type === 'text/vtt' ||
                      item.type === 'application/x-subrip'
                  "
                  class="far fa-closed-captioning yellow--text text--lighten-1"
                ></i>
                <i v-else class="fas fa-file"></i>
              </template>
              <template v-slot:append="{ item }">
                <div v-if="item.type !== 'folder'">
                  <v-btn
                    icon
                    @click="openPlayer(item)"
                    v-if="
                      item.type.startsWith('video') ||
                        item.type.startsWith('audio')
                    "
                  >
                    <v-icon color="indigo lighten-2">fas fa-play</v-icon>
                  </v-btn>

                  <v-btn icon v-if="item.type.startsWith('image')" @click="showImage(item)">
                    <v-icon color="blue darken-2">fas fa-images</v-icon>
                  </v-btn>

                  <v-btn
                    icon
                    tag="a"
                    target="_blank"
                    :href="`/api/torrent/serve/${torrentInfo.infoHash}/${item.path.substr(1) || item.index}`"
                    :download="item.name"
                  >
                    <v-icon color="green darken-2">fas fa-download</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  <v-layout v-else justify-center align-center fill-height>
    <v-flex class="text-xs-center">
      <v-progress-circular :size="100" :width="10" color="primary" indeterminate></v-progress-circular>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import sizeFilter from "../mixins/sizeFilter";
import BookmarkButton from "../components/BookmarkButton";

export default {
  name: "explorer",
  components: {
    BookmarkButton
  },
  data() {
    return {
      tree: [],
      insensitive: true,
      filesOnly: true,
      reverse: false,
      spin: false,
      search: ""
    };
  },
  methods: {
    ...mapActions(["loadTorrentInfo"]),
    showImage(image) {
      this.Swal.fire({
        title: image.name,
        imageUrl: `/api/torrent/serve/${
          this.torrentInfo.infoHash
        }/${image.path.substr(1)}`,
        showConfirmButton: false,
        showCloseButton: true
      });
    },
    openPlayer(item) {
      const { $router, torrentInfo } = this;
      let captions = [];

      try {
        const name = item.name.match(/(.+)\..+/)[1];
        captions = torrentInfo.files
          .filter(
            f =>
              (f.name.endsWith(".srt") || f.name.endsWith(".vtt")) &&
              f.name.indexOf(name) > -1
          )
          .map(
            f =>
              `url::${f.name}::${this.hostURL}/api/torrent/serve/${
                torrentInfo.infoHash
              }/${f.path.substr(1)}`
          );
      } catch (err) {
        console.error(err);
      }

      $router.push({
        name: "player",
        query: {
          torrentId: torrentInfo.infoHash,
          fileIndex: "" + item.index,
          caption: captions
        }
      });
    },
    reload() {
      const { torrentInfo, loadTorrentInfo, $router } = this;
      this.spin = true;
      loadTorrentInfo(torrentInfo.infoHash)
        .catch(err => {
          console.error(err);
          this.Swal.fire({
            type: "error",
            title: "Reload Failed!!",
            confirmButtonText: "Go To Home"
          }).then(() => this.$router.push({ name: "home" }));
        })
        .finally(() => {
          setTimeout(() => (this.spin = false), 1000);
        });
    }
  },
  computed: {
    ...mapState(["torrentInfo"]),
    ...mapGetters(["filesTree"]),
    filter() {
      return (item, search, name) =>
        (item[name] || "").toLowerCase().indexOf(search.toLowerCase()) > -1;
    },
    torrentDownloadLinks() {
      const { name, infoHash } = this.torrentInfo;
      return [
        {
          title: name + ".torrent",
          link: this.hostURL + "/api/torrent/torrentfile/" + infoHash
        },
        {
          title: name + ".m3u",
          link: this.hostURL + "/api/torrent/playlist/" + infoHash
        }
      ];
    },
    shareURL() {
      return `${this.hostURL}/explorer?torrentId=${this.torrentInfo.infoHash}`;
    }
  },
  created() {
    const id = this.$route.query.torrentId;

    const setTitle = () =>
      (document.title = "Live Torrent - Explorer - " + this.torrentInfo.name);

    const invalidTorrentId = () => {
      this.Swal.fire({
        type: "error",
        title: "Invalid Torrent ID",
        text: "Sorry, that torrent id is invalid",
        confirmButtonText: "Go To Home"
      }).then(() => this.$router.push({ name: "home" }));
    };

    if (!id) invalidTorrentId();
    else {
      this.loadTorrentInfo(
        decodeURI(
          id
            .split("%3A")
            .join(":")
            .split("%2F")
            .join("/")
        )
      )
        .then(setTitle)
        .catch(err => {
          console.error(err);
          invalidTorrentId();
        });
    }
  },
  mixins: [sizeFilter]
};
</script>

<style scoped>
.clearfix {
  clear: both;
}

.v-card {
  overflow: auto;
}
</style>
