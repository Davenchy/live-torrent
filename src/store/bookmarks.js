import uuid from "uuid";

export default {
  state: {
    bookmarks: []
  },
  getters: {
    bookmarks: ({ bookmarks }) => bookmarks || []
  },
  mutations: {
    addBookmark(state, bookmark) {
      state.bookmarks.push({
        id: bookmark.id || uuid(),
        name: bookmark.name || "",
        url: bookmark.url || ""
      });
    },
    removeBookmark(state, id) {
      const i = state.bookmarks.findIndex(b => b.id === id);
      if (i === -1) return false;
      state.bookmarks.splice(i, 1);
    },
    setBookmarks(state, bookmarks = []) {
      state.bookmarks = bookmarks;
    }
  },
  actions: {
    loadBookmarks({ commit }) {
      let bookmarks = localStorage.getItem("live-torrent-bookmarks");
      try {
        bookmarks = JSON.parse(bookmarks) || [];
        commit("setBookmarks", bookmarks);
      } catch (_) {
        commit("setBookmarks", []);
      }
    },
    saveBookmarks({ state }) {
      const bookmarks = JSON.stringify(state.bookmarks);
      localStorage.setItem("live-torrent-bookmarks", bookmarks);
    },
    resetBookmarks({ commit }) {
      localStorage.removeItem("live-torrent-bookmarks");
      commit("setBookmarks", []);
    }
  }
};
