import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "ipns",
    component: () => import("../views/ipns-resolve.vue"),
  },
  {
    path: "/ipfs/:cid+",
    name: "ipfs",
    component: () => import("../views/ipns-content.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

export default router;
