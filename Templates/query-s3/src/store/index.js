import Vue from "vue";
import Vuex from "vuex";
import s3 from "./s3";

Vue.use(Vuex);

const SET_DATA = "setData";

const store = new Vuex.Store({
  modules: {
    s3,
  },
  state: {
    nowDate: new Date(),
    ...getWH(),
    isTouch: "ontouchstart" in window,
    isFocus: true,
    userInfo: JSON.parse(localStorage.userInfo || "{}"),
    noticeMsg: {},
    curPath: "/",
    bucketList: JSON.parse(localStorage.bucketList || "[]"),
    curBucket: {},
    client: null,
  },
  mutations: {
    [SET_DATA](state, data) {
      for (const key in data) {
        state[key] = data[key];
      }
    },
  },
});

export const setState = (Vue.prototype.$setState = (data) => {
  store.commit(SET_DATA, data);
});
Vue.prototype.$setMsg = (noticeMsg) => {
  setState({
    noticeMsg,
  });
};

function getWH() {
  const { clientWidth, clientHeight } = document.documentElement;
  const asMobile = clientWidth < 700;
  return {
    clientWidth,
    clientHeight,
    asMobile,
  };
}
window.onresize = () => {
  setState({
    ...getWH(),
  });
};
window.onblur = () => {
  setState({
    isFocus: false,
  });
};
window.onfocus = () => {
  const isTouch = "ontouchstart" in window;
  setState({
    isFocus: true,
    isTouch,
  });
};

setInterval(() => {
  setState({
    nowDate: new Date(),
  });
}, 1e3);

export default store;
