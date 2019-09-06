import Vue from "vue";
import Vuex from "vuex";
import movies from "./movies";
import { getTorrentInfo } from "../utils/axios";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    movies
  },
  state: {
    torrentInfo: null
  },
  getters: {
    filesTree({ torrentInfo }) {
      if (!torrentInfo) return [];
      let id = 0;

      const addFile = (path, file, arr) => {
        const objName = path.shift();
        let obj = arr.find(o => o.name === objName);

        if (!obj) {
          obj = {
            id: id++,
            name: objName,
            type: "folder",
            children: []
          };
          arr.push(obj);
        }

        if (path.length) addFile(path, file, obj.children);
        else obj.children.push({ ...file, id: id++ });

        return arr;
      };

      return torrentInfo.files.reduce((arr, file) => {
        let path = file.path.split("/").filter(a => a);
        path.pop();
        return addFile(path, file, arr);
      }, []);
    }
  },
  mutations: {
    setTorrentInfo(state, torrentFileInfo) {
      state.torrentInfo = torrentFileInfo;
    }
  },
  actions: {
    loadTorrentInfo({ commit }, torrentId) {
      commit("setTorrentInfo", null);
      return getTorrentInfo(torrentId).then(res => {
        commit("setTorrentInfo", res.data);
      });
    },
    refreshTorrentIfo({ state, commit }) {
      const torrent = state.torrentInfo;
      if (torrent) {
        return commit("loadTorrentInfo", torrent.infoHash);
      } else {
        return Promise.reject("no torrent info was loaded");
      }
    }
  }
});
