import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import {
  Image,
  Card,
  Row,
  Col,
  Message,
  Input,
  Button,
  Skeleton,
  SkeletonItem,
  Checkbox,
  Loading,
  CheckboxGroup,
  Table,
  TableColumn,
} from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./css/style.scss";
import VirtualCollection from "vue-virtual-collection";
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);
Vue.use(VirtualCollection);
Vue.use(Image);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Input);
Vue.use(Button);
Vue.use(Skeleton);
Vue.use(SkeletonItem);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.prototype.$message = Message;
Vue.prototype.$loading = Loading.service;
Vue.config.productionTip = false;
Vue.prototype.$store = store;
store.dispatch("getProjectInfo");
new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
