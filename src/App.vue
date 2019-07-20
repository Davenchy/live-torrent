<template>
  <v-app dark style="background: #303742;">
    <!-- <nav-bar /> -->
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import NavBar from "./components/NavBar";
export default {
  name: "App",
  components: {
    NavBar
  }
};
</script>
