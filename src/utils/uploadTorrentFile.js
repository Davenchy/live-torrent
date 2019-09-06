import Swal from "./sweetalert2";
import WebTorrent from "webtorrent";
import ParseTorrent from "parse-torrent";

class TorrentFileUploader {
  constructor() {
    this.dom = null;
    this.build();
    this.onupload = () => {};
  }

  build(parent = document.body) {
    const dom = document.createElement("input");
    dom.type = "file";
    dom.style.display = "none";
    dom.onchange = this.handler.bind(this);
    parent.append(dom);
    this.dom = dom;
  }

  run(cb = () => {}) {
    this.onupload = cb;
    this.dom.click();
  }

  clean() {
    this.dom.remove();
  }

  handler(event) {
    const files = event.target.files;
    if (files.length !== 1)
      Swal.fire("Upload Failed!", "Please select torrent file", "error");
    if (files[0].type !== "application/x-bittorrent")
      Swal.fire(
        "Upload Failed!",
        "The selected file is not a torrent file",
        "error"
      );
    this.readTorrentFile2(files[0]);
    this.clean();
  }

  readTorrentFile(file) {
    const client = new WebTorrent();

    client.on("error", err => {
      console.error(err);
      Swal.fire("Upload Failed!", err.message, "error");
    });

    client.add(file, torrent => {
      torrent.destroy();
      client.destroy();
      this.onupload(torrent.infoHash);
    });
  }

  readTorrentFile2(file) {
    ParseTorrent.remote(file, (err, torrent) => {
      if (err) {
        console.error(err);
        Swal.fire("Upload Failed!", err.message, "error");
      } else {
        this.onupload(torrent.infoHash);
      }
    });
  }
}

export default new TorrentFileUploader();
