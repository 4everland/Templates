import Vue from "vue";
import App from "./App.vue";
import "./setup";
import router from "./router";
import store from "./store";
import "./api";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
