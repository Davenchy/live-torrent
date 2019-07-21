<template>
  <v-layout justify-center align-center fill-height>
    <v-flex xs12 md10>
      <v-card color="#445064">
        <v-card-title>About Live Torrent</v-card-title>
        <v-card-text>
          <p>Live Torrent created to explore, share and play media of torrent files online.</p>
          <p>
            Live Torrent is open source.
            <br />Visit the github repository from
            <a href="https://github.com/Davenchy/live-torrent">here</a>.
          </p>
          <p></p>
          <p>My twitter user: @fadi_davenchy.</p>
          <p>
            Backend is based on
            <a href="https://webtorrent.io">webtorrent</a> project.
          </p>
          <p>
            Video Player is based on
            <a href="https://plyr.io">Plyr.js</a>.
          </p>
          <p>
            Live Torrent is a
            <a href="https://vuejs.org/">vue.js</a> project.
          </p>
          <p>
            Movies from
            <a href="https://yts.am">yts</a>.
          </p>
          <p>
            Subtitles from
            <a href="https://opensubtitles.org">opensubtitles.org</a>.
          </p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "about",
  created() {
    document.title = "Live Torrent - About";
  }
};
</script>
