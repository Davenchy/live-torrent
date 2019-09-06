<template>
  <v-layout fill-height justify-center align-center>
    <v-flex xs12 class="text-xs-center">
      <v-btn color="primary" to="/">
        <v-icon left>fas fa-home</v-icon>Go to Home
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "notfound",
  created() {
    document.title = "Live Torrent - Error 404";
    this.Swal.fire({
      title: "Error 404",
      text: "Page Not Found!",
      type: "error",
      confirmButtonText: "Go To Home Page"
    }).then(() => this.$router.push({ name: "home" }));
  }
};
</script>
