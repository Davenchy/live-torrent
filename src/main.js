import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";

import "./plugins/vuetify";
import "./utils/sweetalert2";
import "./registerServiceWorker";
import "./utils/axios";
import "./utils/clipboard";
import SocialSharing from "vue-social-sharing";

Vue.use(SocialSharing);
Vue.config.productionTip = false;
Vue.prototype.hostURL = window.location.protocol + "//" + window.location.host;
Vue.prototype.window = window;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
