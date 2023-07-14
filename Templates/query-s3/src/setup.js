import Vue from "vue";
import "./utils/extend";
import "./components";
import Element from "element-ui";
import "./css/style.scss";
import VueClipboards from "vue-clipboards";

Vue.use(VueClipboards);
Vue.use(Element);
Vue.prototype.$loading.close = function () {
  Vue.prototype.$loading().close();
};

Vue.prototype.$sleep = (msec = 300) => {
  return new Promise((resolve) => {
    setTimeout(resolve, msec);
  });
};

const mb = Math.pow(1024, 2);
const gb = Math.pow(1024, 3);
Vue.prototype.$utils = {
  isJSON(obj) {
    return (
      typeof obj == "object" &&
      Object.prototype.toString.call(obj).toLowerCase() == "[object object]" &&
      !obj.length
    );
  },
  getFileSize(byte, isObj = false) {
    let num = byte;
    let unit = "Byte";
    if (byte > gb) {
      num = (byte / gb).toFixed(2);
      unit = "GB";
    } else if (byte > mb) {
      num = (byte / mb).toFixed(2);
      unit = "MB";
    } else if (byte > 1024 || (byte < 0.01 && isObj)) {
      num = (byte / 1024).toFixed(2);
      unit = "KB";
    } else if (byte > 0) {
      num = parseInt(byte);
    }
    if (isObj)
      return {
        num,
        unit,
      };
    return num + " " + unit;
  },
};
