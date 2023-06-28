import Vue from "vue";
import axios from "axios";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    reader: null,
    projectInfo: null,
  },
  mutations: {
    SET_READER(state, reader) {
      state.reader = reader;
    },

    CHANGE_DIR(state, { i, key, value }) {
      state.reader.dir[i][key] = value;
    },
    SET_PROJECTINFO(state, info) {
      state.projectInfo = info;
    },
  },
  actions: {
    async getReaderList({ dispatch }) {
      try {
        await this.state.reader.getResult();
        dispatch("loadMore");
      } catch (error) {
        throw new Error(error.message);
      }
    },
    async loadMore({ dispatch }) {
      try {
        await this.state.reader.getNextPage();
        if (!this.state.reader.hasMore) return;
        dispatch("loadMore");
      } catch (error) {
        console.log(error.message);
        if (!this.state.reader.hasMore) return;
        dispatch("loadMore");
      }
    },
    async getProjectInfo({ commit }) {
      try {
        const { data } = await axios.get("./config.json");
        // console.log(data);
        let configObj = {};
        data.config.forEach((item) => {
          item.options.forEach((i) => {
            if (i.key == "ipnsResourceTable") {
              configObj[i.key] = i.items;
            } else {
              configObj[i.key] = i.value;
            }
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
