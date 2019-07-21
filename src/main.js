import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "./axios";
import SocialSharing from "vue-social-sharing";

Vue.use(SocialSharing);
Vue.config.productionTip = false;
Vue.prototype.hostURL = window.location.protocol + "//" + window.location.host;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
