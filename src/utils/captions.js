import SRT2VTT from "srt-webvtt";
import axios from "axios";
import { loadCaptions } from "./axios";
import iconv from "iconv-lite";

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
      } else if (len === 5) {
        caption.type = info[0];
        caption.label = info[1];
        caption.lang = info[2];
        caption.encoding = info[3];
        caption.data = info[4];
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
  const blob = new Blob([caption.data]);
  const url = URL.createObjectURL(blob);
  caption.data = url;
  return loadURL(caption);
};

export const loadURL = caption => {
  return axios
    .get(caption.data, { responseType: "arraybuffer" })
    .then(res => {
      let buffer = Buffer.from(res.data, "binary");

      if (!caption.encoding)
        caption.encoding =
          window.jschardet.detect(buffer.toString()).encoding || "utf8";

      buffer = iconv.decode(buffer, caption.encoding);
      caption.data = buffer;
      return caption;
    })
    .then(caption => {
      const blob = new Blob([caption.data], { type: "text/vtt" });
      const converter = new SRT2VTT(blob);
      return converter.getURL();
    })
    .then(url => {
      caption.url = url;
      return caption;
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
    Object.values(res.data).forEach(s => {
      promises.push(
        loadURL({
          ...caption,
          label: s.lang,
          lang: s.langcode,
          data: s.url,
          encoding: s.encoding
        })
      );
    });
    return promises;
  });
};
