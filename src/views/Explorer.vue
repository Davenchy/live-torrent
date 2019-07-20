<template>
  <v-container fluid mt-5 v-if="torrentInfo">
    <v-layout row>
      <v-flex xs12 md8 offset-md2>
        <v-card>
          <v-sheet class="pa-3">
            <div
              class="title mb-3"
            >{{ torrentInfo.name }} - {{ torrentInfo.size | size }} - Peers: {{ torrentInfo.peers }}</div>

            <v-text-field
              readonly
              flat
              label="Info Hash"
              :value="torrentInfo.infoHash"
              prepend-icon="info"
            />

            <v-text-field readonly flat label="Share Link" :value="shareURL" prepend-icon="share" />

            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn color="primary" class="right" dark v-on="on">
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
            <v-checkbox v-model="insensitive" dark hide-details label="Case Insensitive"></v-checkbox>
            <v-checkbox v-model="filesOnly" dark hide-details label="Files Only"></v-checkbox>
            <v-checkbox v-model="reverse" dark hide-details label="Reverse"></v-checkbox>
          </v-sheet>
          <v-card-text>
            <v-treeview
              v-model="tree"
              :items="filesTree"
              :filter="filter"
              :search="search"
              :open="[0]"
              open-on-click
            >
              <template v-slot:append="{ item }">
                <div v-if="item.type !== 'folder'">
                  <v-btn
                    icon
                    @click="watch(item)"
                    v-if="item.type.startsWith('video') || item.type.startsWith('audio')"
                  >
                    <v-icon color="indigo lighten-2">remove_red_eye</v-icon>
                  </v-btn>

                  <v-btn
                    icon
                    tag="a"
                    target="_blank"
                    :href="`/api/stream/${torrentInfo.infoHash}/${item.index}`"
                    :download="item.name"
                  >
                    <v-icon color="green darken-2">cloud_download</v-icon>
                  </v-btn>
                </div>
              </template>
              <template v-slot:label="{ item, open }">
                <div>
                  <a
                    v-if="item.type!=='folder'"
                    :href="`/api/stream/${torrentInfo.infoHash}/${item.index}`"
                    target="_blank"
                  >{{ item.name }}&nbsp;</a>
                  <span v-else>{{ item.name }}</span>
                  <span v-if="item.type !== 'folder'" class="green--text">- {{ item.size | size }}</span>
                </div>
              </template>
              <template v-slot:prepend="{ item, open }">
                <i
                  v-if="item.type === 'folder'"
                  :class="`fas fa-${open ? 'folder-open text--lighten-2' : 'folder text--darken-2'} blue--text`"
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
                  v-else-if="item.type === 'text/vtt' || item.type === 'application/x-subrip'"
                  class="far fa-closed-captioning yellow--text text--lighten-1"
                ></i>
                <i v-else class="fas fa-file"></i>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  <v-layout v-else justify-center align-center fill-height>
    <v-flex xs1 offset-xs>
      <v-progress-circular :size="100" :width="10" color="primary" indeterminate></v-progress-circular>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import sizeFilter from "../mixins/sizeFilter";

export default {
  name: "explorer",
  data() {
    return {
      tree: [],
      insensitive: true,
      filesOnly: true,
      reverse: false,
      search: ""
    };
  },
  methods: {
    ...mapActions(["loadTorrentInfo"]),
    watch(item) {
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
              `${f.name}::${this.hostURL}/api/stream/${torrentInfo.infoHash}/${f.index}`
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
    }
  },
  computed: {
    ...mapState(["torrentInfo"]),
    ...mapGetters(["filesTree"]),
    filter() {
      return (item, search, name) => {
        const { filesOnly, insensitive, reverse } = this;

        if (item.type === "folder" && filesOnly) return;

        name = item[name];
        if (insensitive) {
          name = name.toLowerCase();
          search = search.toLowerCase();
        }

        const v = name.toLowerCase().indexOf(search.toLowerCase()) > -1;
        return reverse ? !v : v;
      };
    },
    torrentDownloadLinks() {
      const { name, infoHash } = this.torrentInfo;
      return [
        {
          title: name + ".zip",
          link: this.hostURL + "/api/download/" + infoHash
        },
        {
          title: name + ".torrent",
          link: this.hostURL + "/api/torrentfile/" + infoHash
        },
        {
          title: name + ".m3u",
          link: this.hostURL + "/api/playlist/" + infoHash
        }
      ];
    },
    shareURL() {
      return `${this.hostURL}/explorer?torrentId=${this.torrentInfo.infoHash}`;
    }
  },
  created() {
    const id = this.$route.query.torrentId;

    if (!this.torrentInfo) {
      if (!id) this.$router.push({ name: "home" });
      else {
        this.loadTorrentInfo(id).catch(err => {
          console.error(err);
          this.$router.push({ name: "home" });
        });
      }
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
