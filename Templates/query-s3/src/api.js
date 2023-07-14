import vue from "vue";
import axios from "axios";
import { Message } from "element-ui";

const http = axios.create({
  // withCredentials: true,
});

http.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    let msg = error.message;
    const { data = {} } = error.response || {};
    if (data.msg) {
      msg = data.msg;
    }
    Message.warning(msg);
    throw error;
  }
);

vue.prototype.$http = http;

export default http;
