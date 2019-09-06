import Swal from "./sweetalert2";
import ParseTorrent from "parse-torrent";

class TorrentFileUploader {
  constructor() {
    this.dom = null;
    this._build();
    this.onupload = () => {};
  }

  _build(parent = document.body) {
    const dom = document.createElement("input");
    dom.type = "file";
    dom.accept = ".torrent";
    dom.style.display = "none";
    dom.onchange = this._handler.bind(this);
    parent.append(dom);
    this.dom = dom;
  }

  run(cb = () => {}) {
    this.onupload = cb;
    this.dom.click();
  }

  _clean() {
    this.dom.remove();
  }

  _handler(event) {
    const files = event.target.files;

    if (files.length === 0) return;
    else if (files.length !== 1)
      Swal.fire("Upload Failed!", "Please select torrent file", "error");

    if (files[0].type !== "application/x-bittorrent")
      Swal.fire(
        "Upload Failed!",
        "The selected file is not a torrent file",
        "error"
      );

    this._readTorrentFile(files[0]);
    this._clean();
  }

  _readTorrentFile(file) {
    ParseTorrent.remote(file, (err, torrent) => {
      if (err) {
        console.error(err);
        Swal.fire(
          "Upload Failed!",
          "Failed to parse the torrent file",
          "error"
        );
      } else {
        this.onupload(torrent.infoHash);
      }
    });
  }
}

export default new TorrentFileUploader();
