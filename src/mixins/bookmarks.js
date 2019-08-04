import Bookmarks from "../utils/bookmarks";

export default {
  data() {
    return {
      bookmarkObject: undefined
    };
  },
  created() {
    this.$Bookmark = Bookmarks;
    this.refreshBookmarkState();
    Bookmarks.on("update", () => this.refreshBookmarkState());
  },
  computed: {
    isBookmarked() {
      return !!this.bookmarkObject;
    }
  },
  methods: {
    refreshBookmarkState() {
      const { id } = this.bookmarkInfo;
      if (!id) return;
      this.bookmarkObject = Bookmarks.find(id);
    },
    toggleBookmark() {
      if (this.isBookmarked) this.unBookmark();
      else this.bookmark();
      this.refreshBookmarkState();
    },
    bookmark() {
      if (this.isBookmarked) return;
      Bookmarks.add(this.bookmarkInfo);
    },
    unBookmark() {
      if (!this.isBookmarked) return;
      Bookmarks.remove(this.bookmarkInfo.id);
    }
  }
};
