import Vue from "vue";
import axios from "axios";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    projectInfo: null,
  },
  mutations: {
    SET_PROJECTINFO(state, info) {
      state.projectInfo = info;
    },
  },
  actions: {
    async getProjectInfo({ commit }) {
      try {
        const { data } = await axios.get("/config.json");
        // console.log(data);
        let configObj = {};
        data.config.forEach((item) => {
          item.options.forEach((i) => {
            configObj[i.key] = i.items || i.value;
          });
        });
        commit("SET_PROJECTINFO", configObj);
        let websiteNameObj = data.config.filter((it) => {
          return it.name == "Website Name";
        });
        document.title = websiteNameObj[0].options[0].value || "IPNS LinkShare";
      } catch (error) {
        console.log(error);
      }
    },
  },
});
export default store;
