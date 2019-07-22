<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs10 offset-xs1 md8 offset-md2>
        <v-text-field
          placeholder="Looking for..."
          solo
          light
          :loading="loading"
          clearable
          :disabled="loading"
          autofocus
          v-model="query"
          @keydown.enter="search"
          :error-messages="errors"
        />
        <div class="text-xs-center">
          <v-btn color="info" @click="search" :loading="loading" :disabled="loading">Search</v-btn>
        </div>
      </v-flex>
      <v-flex xs2 offset-xs1>
        <v-select
          label="Provider"
          :disabled="loading"
          v-model="provider"
          return-object
          item-text="name"
          :items="providers"
        ></v-select>
      </v-flex>
      <v-flex xs2 offset-xs2>
        <v-select
          label="Category"
          :disabled="loading"
          v-model="category"
          :items="provider !== null ? provider.categories : ['All']"
        ></v-select>
      </v-flex>
      <v-flex xs2 offset-xs2>
        <v-text-field
          v-model="limit"
          label="Results Limit"
          hide-details
          max="1000"
          min="1"
          type="number"
          :disabled="loading"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 class="mt-3">
        <v-container fluid>
          <v-layout justify-center row wrap>
            <v-flex xs12 v-for="(result, i) in results" :key="i">
              <v-sheet color="#445064" class="pa-3 mb-3" style="overflow: auto;">
                <div class="title mb-2">
                  <a :href="`${hostURL}/explorer?torrentId=${result.magnet}`">{{ result.title }}</a>
                  - Seeds/Peers: {{ result.seeds }}/{{ result.peers }} ::
                  <a
                    :href="result.link || result.desc"
                    target="_blank"
                  >{{ result.provider }}</a>
                </div>
                <v-layout row>
                  <v-flex xs6>
                    <div class="caption">Size: {{ result.size }}</div>
                    <div class="caption">Hash: {{ result.hash }}</div>
                  </v-flex>
                  <v-flex xs6 class="text-xs-right">
                    <div class="caption grey--text text--lighten-1">{{ result.time }}</div>
                  </v-flex>
                </v-layout>
                <div class="subheading text-truncate mt-3" v-if="result.desc">{{ result.desc }}</div>
              </v-sheet>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { searchEngine, searchProviders } from "../axios";

export default {
  name: "search",
  data() {
    return {
      query: "",
      limit: 100,
      category: "All",
      provider: null,
      loading: false,
      errors: "",
      providers: [],
      results: []
    };
  },
  methods: {
    search() {
      const { query, provider, limit, category } = this;
      this.loading = true;
      const params = { query, limit, category: category || "All" };
      if (provider) params.provider = provider.name;
      this.errors = "";

      searchEngine(params)
        .then(res => {
          this.results = res.data;
          console.log(res.data);
        })
        .catch(err => {
          console.error(err);
          this.errors = err.message;
        })
        .finally(() => (this.loading = false));
    }
  },
  created() {
    const { q } = this.$route.query;
    if (q) {
      this.query = q;
      this.search();
    }

    document.title = "Live Torrent - Search Engine";

    searchProviders()
      .then(res => {
        this.providers = res.data;
        this.provider = this.providers[0].name;
      })
      .catch(err => {
        console.error(err);
        this.errors = err.message;
      });
  }
};
</script>
