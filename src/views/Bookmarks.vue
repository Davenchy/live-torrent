<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 mb-5 class="text-xs-center">
        <h1 class="title">
          <v-icon left>fas fa-bookmark</v-icon>Bookmarks
        </h1>
      </v-flex>
      <v-flex xs12 class="text-xs-center">
        <v-btn @click="$Bookmarks.reset()" color="red" v-if="bookmarks.length">
          <v-icon left>fas fa-trash</v-icon>Remove All
        </v-btn>
        <v-btn @click="refresh" color="green">
          <v-icon left>fas fa-sync</v-icon>Refresh
        </v-btn>
        <v-btn @click="share" color="teal">
          <v-icon left>fas fa-copy</v-icon>Copy
        </v-btn>
      </v-flex>
      <v-flex xs8 ma-2 v-for="(bookmark, i) in bookmarks" :key="i">
        <a :href="bookmark.url">{{ bookmark.name }}</a>
        <v-btn icon @click="$Bookmarks.remove(bookmark.id)">
          <v-icon small color="red">fas fa-trash</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="$copy(`${hostURL}/bookmarks?bookmark=${btoa(JSON.stringify(bookmark))}`)"
        >
          <v-icon small>fas fa-copy</v-icon>
        </v-btn>
      </v-flex>
      <v-flex v-if="!bookmarks.length" my-5 class="text-xs-center">
        <h1 class="subheading">No bookmarks</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Bookmarks from "../utils/bookmarks";

export default {
  name: "bookmarks",
  data() {
    return {
      bookmarks: []
    };
  },
  methods: {
    refresh() {
      this.bookmarks = Bookmarks.bookmarks;
    },
    share() {
      const data = Bookmarks.toString()
        .replace("+", "_")
        .replace(",", "-")
        .replace("/", ".");
      this.$copy(this.hostURL + "/bookmarks?bookmarks=" + data);
    },
    btoa(text) {
      return btoa(text);
    }
  },
  created() {
    this.$Bookmarks = Bookmarks;
    document.title = "Live Torrent - Bookmarks";
    const { bookmark, bookmarks } = this.$route.query;

    let bm = [],
      bms = [],
      bmsToAdd = [];

    // make sure that all queries are in form of arrays
    if (Array.isArray(bookmark)) bm = bookmark;
    else bm = [bookmark];
    if (Array.isArray(bookmarks)) bms = bookmarks;
    else bms = [bookmarks];

    // add each bookmark into the array of bookmarks
    bm.filter(a => a).forEach(b => {
      try {
        bmsToAdd.push(JSON.parse(atob(b)));
      } catch (e) {
        console.error(e);
      }
    });

    // add bookmarks in the bookmarks collection into the array of bookmarks
    bms
      .filter(a => a)
      .forEach(b => {
        try {
          b = b
            .replace("_", "+")
            .replace("-", "=")
            .replace(".", "/");
          console.log(b);
          b = JSON.parse(atob(b));
          b.forEach(a => bmsToAdd.push(a));
        } catch (e) {
          console.error(e);
        }
      });

    // add all bookmarks
    bmsToAdd.forEach(b => Bookmarks.add(b, false));
    Bookmarks.save();

    // refresh bookmarks
    this.refresh();
    Bookmarks.on("update", this.refresh);
  }
};
</script>

<style scoped>
a {
  color: #f2f2f2;
  text-decoration: none;
}
</style>
