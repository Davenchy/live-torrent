import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";

import "./plugins/vuetify";
import "./registerServiceWorker";
import "./services/axios";
import SocialSharing from "vue-social-sharing";

Vue.use(SocialSharing);
Vue.config.productionTip = false;
Vue.prototype.hostURL = window.location.protocol + "//" + window.location.host;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
