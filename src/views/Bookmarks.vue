<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 mb-5 class="text-xs-center">
        <h1 class="title">
          <v-icon left>fas fa-bookmark</v-icon>Bookmarks
        </h1>
      </v-flex>
      <v-flex xs12 class="text-xs-center">
        <v-btn @click="resetBookmarks" color="red" v-if="bookmarks.length">
          <v-icon left>fas fa-trash</v-icon>Remove All
        </v-btn>
        <v-btn @click="loadBookmarks" color="green">
          <v-icon left>fas fa-sync</v-icon>Refresh
        </v-btn>
      </v-flex>
      <v-flex xs8 ma-2 v-for="(bookmark, i) in bookmarks" :key="i">
        <a :href="bookmark.url">{{ bookmark.name }}</a>
        <v-btn icon @click="remove(bookmark.id)">
          <v-icon small color="red">fas fa-trash</v-icon>
        </v-btn>
      </v-flex>
      <v-flex v-if="!bookmarks.length" my-5 class="text-xs-center">
        <h1 class="subheading">No bookmarks</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";

export default {
  name: "bookmarks",
  methods: {
    ...mapActions(["loadBookmarks", "saveBookmarks", "resetBookmarks"]),
    ...mapMutations(["removeBookmark"]),
    remove(id) {
      this.removeBookmark(id);
      this.saveBookmarks();
    }
  },
  computed: {
    ...mapGetters(["bookmarks"])
  },
  created() {
    document.title = "Live Torrent - Bookmarks";
    this.loadBookmarks();
  }
};
</script>

<style scoped>
a {
  color: #f2f2f2;
  text-decoration: none;
}
</style>
