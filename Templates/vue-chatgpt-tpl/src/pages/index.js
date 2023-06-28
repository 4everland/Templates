import PageChat from "./chat/page-chat.vue";
import PageConfig from "./config/page-config.vue";

export default [
  {
    path: "/",
    component: PageChat,
  },
  {
    path: "/config",
    component: PageConfig,
  },
];
