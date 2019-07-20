<template>
  <v-layout fill-height justify-center align-center>
    <v-flex xs10 md6>
      <v-card light>
        <v-card-title class="headline red darken-1 white--text" primary-title>Sorry!</v-card-title>

        <v-card-text
          class="text-xs-center display-1 red--text text--darken-4"
        >Error 404: Page Not Found</v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat to="/">Go to Home</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "notfound"
};
</script>
