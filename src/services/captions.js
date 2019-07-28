import SRT2VTT from "srt-webvtt";
import axios from "axios";
import { loadCaptions } from "./axios";

export default async function(query) {
  let promises = [];
  let imdbidCaption;

  (Array.isArray(query.caption) ? query.caption : [query.caption]).forEach(
    c => {
      if (!c || c.trim() === "") return;

      // parse caption information
      const info = c.split("::");
      const len = info.length;
      let caption = { data: null, label: "Unknown", lang: false, type: null };

      if (len === 2) {
        caption.type = info[0];
        caption.data = info[1];
      } else if (len === 3) {
        caption.type = info[0];
        caption.label = info[1];
        caption.data = info[2];
      } else if (len === 4) {
        caption.type = info[0];
        caption.label = info[1];
        caption.lang = info[2];
        caption.data = info[3];
      } else return;

      caption.originalData = caption.data;

      // load caption data
      if (caption.type === "text") {
        promises.push(loadText(caption));
      } else if (caption.type === "url") {
        promises.push(loadURL(caption));
      } else if (caption.type === "imdbid" && !imdbidCaption) {
        imdbidCaption = caption;
      } else return;
    }
  );

  if (imdbidCaption) {
    const ps = await loadIMDBID(imdbidCaption);
    ps.forEach(p => promises.push(p));
  }
  return Promise.all(promises);
}

export const loadText = caption => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([caption.data], { type: "text/vtt" });
    const converter = new SRT2VTT(blob);
    converter
      .getURL()
      .then(url => {
        caption.url = url;
        resolve(caption);
      })
      .catch(err => reject(err));
  });
};

export const loadURL = caption => {
  return axios
    .get(caption.data)
    .then(res => {
      caption.data = res.data;
      return loadText(caption);
    })
    .catch(err => {
      console.error(err);
      console.error("Cannot load this caption:", caption);
      return undefined;
    });
};

export const loadIMDBID = caption => {
  return loadCaptions(caption.data).then(res => {
    let promises = [];
    res.data.forEach(s => {
      promises.push(
        loadURL({ ...caption, label: s.lang, lang: s.langcode, data: s.utf8 })
      );
    });
    return promises;
  });
};
