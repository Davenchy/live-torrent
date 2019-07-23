<template>
  <v-card light>
    <v-img
      :src="movie.medium_cover_image"
      :lazy-src="movie.small_cover_image"
      :alt="movie.title + '\'s poster'"
      min-height="200px"
      class="black--text text--lighten-2"
    >
      <template v-slot:placeholder>
        <v-layout fill-height align-center justify-center ma-0>
          <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
        </v-layout>
      </template>

      <v-container fluid class="pa-0">
        <v-card-title class="title">{{ movie.title }}</v-card-title>
      </v-container>
    </v-img>
  </v-card>
</template>

<script>
export default {
  props: {
    movie: {
      required: true,
      type: Object
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  text-shadow: 1px 0px 1px #fff, -1px 0px 1px #fff, 0px 1px 1px #fff,
    0px -1px 1px #fff;
}
</style>
