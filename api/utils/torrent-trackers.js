const axios = require("axios");
const trackersURL =
  "https://raw.githubusercontent.com/ngosang/trackerslist/master/trackers_all.txt";

let trackers = [];

const refreshTrackers = (done = () => {}) => {
  console.log("refreshing trackers list");
  axios
    .get(trackersURL)
    .then(req => {
      trackers = [];
      let token = "";

      for (let i = 0; i < req.data.length; i++) {
        const c = req.data[i];
        if (c === "\n") {
          token = token.trim();
          if (token.length) trackers.push(token);
          token = "";
        } else token += c;
      }

      trackers.refresh = refreshTrackers;

      console.log(`trackers list contains ${trackers.length} tracker(s)`);
      done(null, trackers);
    })
    .catch(err => {
      console.error(err);
      done(err);
    });
};

// refresh trackers
refreshTrackers();

// refresh trackers every day
setTimeout(refreshTrackers, 1000 * 60 * 60 * 24);

module.exports = trackers;
