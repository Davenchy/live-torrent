import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";

import "./plugins/vuetify";
import "./utils/sweetalert2";
import "./registerServiceWorker";
import "./utils/axios";
import SocialSharing from "vue-social-sharing";
import clipboard from "./utils/clipboard";

Vue.use(SocialSharing);
Vue.config.productionTip = false;
Vue.prototype.hostURL = window.location.protocol + "//" + window.location.host;
Vue.prototype.window = window;
Vue.prototype.$clipboard = clipboard;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
