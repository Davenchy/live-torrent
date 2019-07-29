export default {
  created() {
    this.$store.dispatch("loadBookmarks");
  },
  computed: {
    bookmarkObject() {
      const { id } = this.bookmarkInfo;
      if (!id) return;
      return this.$store.state.bookmarks.bookmarks.find(b => b.id === id);
    },
    isBookmarked() {
      return !!this.bookmarkObject;
    }
  },
  methods: {
    toggleBookmark() {
      if (this.isBookmarked) this.unBookmark();
      else this.bookmark();
    },
    bookmark() {
      if (this.isBookmarked) return;
      this.$store.commit("addBookmark", this.bookmarkInfo);
      this.$store.dispatch("saveBookmarks");
    },
    unBookmark() {
      if (!this.isBookmarked) return;
      this.$store.commit("removeBookmark", this.bookmarkInfo.id);
      this.$store.dispatch("saveBookmarks");
    }
  }
};
