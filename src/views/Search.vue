<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex class="my-5 text-xs-center">
        <h1>Torrent Search Engine</h1>
      </v-flex>
      <v-flex xs12 md8 offset-md2 mb-4>
        <v-text-field
          placeholder="Looking for..."
          solo
          light
          :loading="loading"
          clearable
          :disabled="loading"
          :autofocus="!$vuetify.breakpoint.xsOnly"
          v-model="query"
          @keydown.enter="search"
          :error-messages="errors"
          @click:clear="clearResults"
        />
      </v-flex>
      <v-flex sm2 offset-sm1 xs12>
        <v-select
          label="Provider"
          :disabled="loading"
          v-model="provider"
          return-object
          item-text="name"
          :items="providers"
          @change="categories = provider.categories"
        ></v-select>
      </v-flex>
      <v-flex sm2 offset-sm2 xs6>
        <v-select
          label="Category"
          :disabled="loading"
          v-model="category"
          :items="categories.length ? categories : ['All']"
        ></v-select>
      </v-flex>
      <v-flex sm2 offset-sm2 xs6>
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

      <v-flex xs12 mt-3 class="text-xs-center">
        <v-btn color="green" @click="search" :disabled="loading">
          Search
          <v-icon right>fas fa-search</v-icon>
        </v-btn>
      </v-flex>

      <v-flex xs12 v-if="query && searchResults.length">
        <div class="subheading">Share:</div>

        <social-sharing
          :url="`${hostURL}/search?q=${query}&p=${provider}&l=${limit}&c=${category}`"
          :title="`Torrent search results for '${query}'`"
          :description="`See torrent search results for '${query}'`"
          hashtags="live_torrent"
          twitter-user="fadi_davenchy"
          network-tag="a"
          class="my-3"
          inline-template
        >
          <div>
            <network network="facebook" class="blue--text text--darken-2 ma-3">
              <i class="fab fa-facebook"></i> Facebook
            </network>
            <network network="reddit" class="red--text text--lighten-1 ma-3">
              <i class="fab fa-reddit-alien"></i> Reddit
            </network>
            <network network="twitter" class="blue--text text--lighten-4 ma-3">
              <i class="fab fa-twitter"></i> Twitter
            </network>
            <network network="telegram" class="blue--text text--lighten-2 ma-3">
              <i class="fab fa-telegram"></i> Telegram
            </network>
            <network network="skype" class="blue--text ma-3">
              <i class="fab fa-skype"></i> Skype
            </network>
            <network network="sms" class="yellow--text ma-3">
              <i class="fas fa-sms"></i> SMS
            </network>
            <network network="email" class="orange--text ma-3">
              <i class="fas fa-envelope"></i> Email
            </network>
            <network network="vk" class="blue--text text--darken-3 ma-3">
              <i class="fab fa-vk"></i> VKontakte
            </network>
            <network network="weibo" class="red--text text--darken-1 ma-3">
              <i class="fab fa-weibo"></i> Weibo
            </network>
            <network network="whatsapp" class="green--text text--lighten-2 ma-3">
              <i class="fab fa-fw fa-whatsapp"></i> Whatsapp
            </network>
          </div>
        </social-sharing>
      </v-flex>

      <v-flex xs12 class="text-xs-right" v-if="searchResults.length">
        <v-btn color="red" @click="clearResults">Clear Results</v-btn>
      </v-flex>

      <v-flex xs12 class="mt-3">
        <v-layout justify-center row wrap>
          <v-flex xs12 v-for="(result, i) in searchResults" :key="i">
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
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { searchEngine, searchProviders } from "../axios";
import { mapActions, mapState, mapMutations } from "vuex";
import { parse } from "path";

export default {
  name: "search",
  data() {
    return {
      query: "",
      limit: 10,
      category: "All",
      provider: null,
      loading: false,
      errors: "",
      providers: [],
      categories: [],
      searchResults: []
    };
  },
  methods: {
    search() {
      const { query, provider, limit, category } = this;
      if (!query) return (this.errors = "Query is needed");
      this.loading = true;
      const params = { query, limit, category: category || "All" };
      if (provider && provider.name !== "All") params.provider = provider.name;
      this.errors = "";

      searchEngine(params)
        .then(({ data }) => {
          this.searchResults = data;
          if (data.length === 0) this.errors = "No results for " + this.query;
        })
        .catch(err => {
          console.error(err);
          this.errors = err.message;
        })
        .finally(() => (this.loading = false));
    },
    clearResults() {
      this.query = "";
      this.searchResults = [];
    },
    readStorage(key) {
      const value = sessionStorage.getItem(key);
      return value !== null ? value : undefined;
    }
  },
  watch: {
    provider: x => sessionStorage.setItem("tse.provider", x.name || "All"),
    query: x => sessionStorage.setItem("tse.query", x || ""),
    category: x => sessionStorage.setItem("tse.category", x || "All"),
    limit: x => sessionStorage.setItem("tse.limit", x || 10),
    searchResults: x => sessionStorage.setItem("tse.results", JSON.stringify(x))
  },
  created() {
    this.loading = true;
    const { readStorage } = this;
    const { q, p, c, l } = this.$route.query;

    this.provider = p ? p : readStorage("tse.provider") || "All";
    this.category = c ? c : readStorage("tse.category") || "All";
    this.limit = l ? l : readStorage("tse.limit") || 10;
    this.query = q ? q : readStorage("tse.query") || "";
    const results = readStorage("tse.results");
    this.searchResults = results ? JSON.parse(results) : [];

    if (q) this.search();

    document.title = "Live Torrent - Search Engine";

    searchProviders()
      .then(res => {
        this.providers = [
          {
            name: "All",
            categories: [
              "All",
              "Movies",
              "TV",
              "Anime",
              "Music",
              "Games",
              "Applications",
              "Books"
            ]
          },
          ...(res.data || [])
        ];
        this.categories = this.providers.find(
          p => p.name === this.provider
        ).categories;
      })
      .catch(err => {
        console.error(err);
        this.errors = err.message;
      })
      .finally(() => (this.loading = false));
  }
};
</script>
