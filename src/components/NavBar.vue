<template>
  <div>
    <v-toolbar color="#363e49" v-if="small">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title @click="$router.push('/')">
        <img src="/img/logo.png" style="max-height: 5em" alt="live torrent logo" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$router.go(-1)">
        <i class="fas fa-chevron-left"></i>
      </v-btn>
      <v-btn icon @click="$router.go(1)">
        <i class="fas fa-chevron-right"></i>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer
      :value="small ? drawer : true"
      hide-overlay
      :floating="small"
      :temporary="small"
      :mini-variant="small ? false : mini"
      stateless
      app
      style="background: #414758;"
      @update:mini-variant="drawer = !drawer"
    >
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar @click.stop="mini = !mini">
            <v-list-tile-avatar>
              <img src="/img/logo.png" />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>Live Torrent</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon @click.stop="drawer = !drawer" v-if="small">
                <v-icon>close</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>

        <v-list-tile
          v-for="item in items"
          :key="item.title"
          :to="item.path"
          @click="drawer = !drawer;"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="$router.go(-1)" v-if="!small">
          <v-list-tile-action>
            <i class="fas fa-chevron-left"></i>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Go Back</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="$router.go(1)" v-if="!small">
          <v-list-tile-action>
            <i class="fas fa-chevron-right"></i>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>Go Forward</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>


<script>
export default {
  data() {
    return {
      drawer: true,
      mini: false,
      items: [
        { title: "Home", icon: "fas fa-home", path: "/" },
        { title: "Search", icon: "fab fa-searchengin", path: "/search" },
        // { title: "Movies", icon: "fas fa-film", path: "/movies" },
        { title: "About", icon: "info", path: "/about" }
      ]
    };
  },
  computed: {
    small() {
      return this.$vuetify.breakpoint.xsOnly;
    }
  },
  created() {
    if (this.small) {
      this.drawer = false;
      this.mini = false;
    } else {
      this.mini = true;
      this.drawer = true;
    }
  }
};
</script>