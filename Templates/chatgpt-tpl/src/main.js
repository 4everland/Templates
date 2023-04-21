import { createApp } from "vue";
import App from "./App.vue";
import "./css/style.scss";
import router from "./router";
import store, { setState, setStore } from "./store";

const app = createApp(App);
app.use(router);
app.use(store);

const global = app.config.globalProperties;
global.$setState = setState;
global.$setStore = setStore;

app.mount("#app");
