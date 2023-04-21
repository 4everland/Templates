import { createStore } from "vuex";

const SET_DATA = "setData";

const storState = {
  appInfo: {},
};
for (const key in storState) {
  let val = localStorage[key];
  if (val) storState[key] = JSON.parse(val);
}

const store = createStore({
  state() {
    return {
      nowDate: new Date(),
      ...getWH(),
      isTouch: "ontouchstart" in window,
      // scrollTop: 0,
      isFocus: true,
      noticeMsg: {
        name: "",
        data: {},
      },
      ...storState,
    };
  },
  mutations: {
    [SET_DATA](state, data) {
      for (const key in data) {
        state[key] = data[key];
      }
    },
  },
});

export const setState = (data) => {
  store.commit(SET_DATA, data);
};
export const setStore = (data) => {
  for (const key in data) {
    localStorage[key] = JSON.stringify(data[key]);
  }
  setState(data);
};

function getWH() {
  const { clientWidth, clientHeight } = document.documentElement;
  const asMobile = clientWidth < 500 || clientHeight < 600;
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
  setState({
    isFocus: true,
  });
};

setInterval(() => {
  setState({
    nowDate: new Date(),
  });
}, 1e3);

// window.onscroll = () => {
//   setState({
//     scrollTop: window.scrollY,
//   });
// };

export default store;
