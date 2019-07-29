<template>
  <v-btn icon small color="yellow--text text--darken-3" @click="toggleBookmark">
    <v-icon>fa{{ isBookmarked ? 's' : 'r' }} fa-bookmark</v-icon>
  </v-btn>
</template>

<script>
import BookmarksMixin from "../mixins/bookmarks";

export default {
  name: "bookmark-btn",
  props: {
    bookmarkInfo: {
      type: Object,
      required: true,
      default: {
        id: "",
        name: "",
        url: ""
      }
    }
  },
  mixins: [BookmarksMixin]
};
</script>