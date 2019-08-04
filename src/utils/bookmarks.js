import uuid from "uuid";

class Events {
  constructor() {
    this.events = {};
  }

  emit(event, ...args) {
    const events = this.events[event];
    if (!events) return false;
    events.forEach((event, i) => {
      event.cb.apply(this, args);
      if (events.once) events.splice(i, 1);
    });
    return true;
  }

  on(event, cb, once = false) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push({ cb, once });
  }
}

class Bookmarks extends Events {
  constructor(key = "", debug = false) {
    super();

    this.key = key;
    this.debug = debug;
    this.bookmarks = [];

    window.addEventListener(
      "storage",
      e => {
        if (e.key === this.key) {
          this.load();
          this.emit("update", e);
        }
      },
      false
    );

    this.load();
  }

  add(bookmark, autoSave = true) {
    if (this.find(bookmark.id)) return false;
    this.bookmarks.push(
      Object.assign(
        {
          id: uuid(),
          name: "New Bookmark",
          url: location.href
        },
        bookmark
      )
    );
    if (autoSave) return this.save();
    return true;
  }

  remove(id, autoSave = true) {
    const index = this.bookmarks.findIndex(b => b.id === id);
    if (index === -1) return false;
    this.bookmarks.splice(index, 1);
    if (autoSave) return this.save();
    return true;
  }

  find(id) {
    return this.bookmarks.find(b => b.id === id);
  }

  load() {
    try {
      let data = localStorage.getItem(this.key);
      data = atob(data) || "[]";
      this.bookmarks = JSON.parse(data) || [];
    } catch (err) {
      if (this.debug) console.error(err);
      this.bookmarks = [];
    }
  }

  save() {
    try {
      let bookmarks = JSON.stringify(this.bookmarks) || "[]";
      bookmarks = btoa(bookmarks);
      localStorage.setItem(this.key, bookmarks);
    } catch (err) {
      if (this.debug) console.error(err);
    }
  }

  reset() {
    this.bookmarks = [];
    localStorage.removeItem(this.key);
    this.emit("update");
  }

  fromString(code = "[]", append = false, autoSave = true) {
    let obj = [];

    try {
      code = atob(code) || "[]";
      obj = JSON.parse(code) || [];
    } catch (err) {
      if (this.debug) console.error(err);
      return false;
    }

    if (append) obj.forEach(b => this.add(b, false));
    else this.bookmarks = obj;

    if (autoSave) this.save();
  }

  toString() {
    try {
      let bookmarks = JSON.stringify(this.bookmarks);
      return btoa(bookmarks);
    } catch (err) {
      if (this.debug) console.error(err);
      return btoa("[]");
    }
  }
}

const bookmarks = new Bookmarks("live-torrent-bookmarks");

export default bookmarks;
