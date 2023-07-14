import Vue from "vue";

const comps = require.context("./", true, /\.(vue)$/);

comps.keys().forEach((fileName) => {
  const comp = comps(fileName);
  const name = fileName
    .replace(/\/index.vue$/, "")
    .replace(/^.*\//, "")
    .replace(".vue", "");
  Vue.component(name, comp.default || comp);
});
