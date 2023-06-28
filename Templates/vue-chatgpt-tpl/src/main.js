import { createApp } from "vue";
import App from "./App.vue";
import "./css/style.scss";
import "./utils/extend";
import router from "./router";
import store, { setState, setStore } from "./store";

const app = createApp(App);
app.use(router);
app.use(store);

const global = app.config.globalProperties;
global.$setState = setState;
global.$setStore = setStore;
global.$setMsg = (noticeMsg) => {
  if (typeof noticeMsg == "string") {
    noticeMsg = {
      name: noticeMsg,
    };
  }
  setState({
    noticeMsg,
  });
};
global.$sleep = (msec = 300) => {
  return new Promise((resolve) => {
    setTimeout(resolve, msec);
  });
};

app.mount("#app");
