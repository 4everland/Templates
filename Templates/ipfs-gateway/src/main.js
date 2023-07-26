import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize.css/normalize.css";

import "./utils/axios";

Vue.config.productionTip = false;
await store.dispatch("getProjectInfo");

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
