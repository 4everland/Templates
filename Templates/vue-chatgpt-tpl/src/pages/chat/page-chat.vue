<style lang="scss">
.send-wrap {
  margin: 0 20px 20px;
  border: 1px solid #eee;
  padding-right: 80px;
  textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    font-size: 15px;
    font-family: monospace;
  }
}
.send-btn {
  padding: 6px;
  &.bg-1 {
    cursor: pointer;
    &:hover {
      box-shadow: 0px 3px 4px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>

<template>
  <div class="h100p h-flex">
    <div class="header-1 al-c">
      <div>
        <h2 class="fz-16">{{ curSession.title }}</h2>
        <!-- <p class="fz-12 gray">{{ curSession.msgNum }} message</p> -->
      </div>
      <div class="ml-auto">
        <div class="d-ib btn-wrap bd-gray" @click="onClear">
          <img src="img/clean.svg" width="14" class="d-b" />
        </div>
      </div>
    </div>

    <div class="flex-1 ov-a pa-3" ref="chatList" @scroll="onScroll">
      <div class="chat-wrap">
        <chat-list
          :list="comboList"
          :logo="logo"
          :avatar="info.avatar || 'img/avatar.jpg'"
        ></chat-list>
      </div>
    </div>

    <!-- <div class="pos-r">
      <div
        class="pos-a right-0 mr-3 pa-3 hover-1"
        style="top: -56px"
        v-if="!isBtm"
        @click="smoothToBtm"
      >
        <img src="img/to-btm.svg" width="30" />
      </div>
    </div> -->
    <div class="send-wrap pos-r bdrs-10 ov-h">
      <textarea
        class="pa-3"
        rows="4"
        placeholder="Enter something... Press Ctrl + Enter to send message"
        v-model="inputMsg"
        @keyup.enter.ctrl="onSend"
      ></textarea>
      <div class="pos-a right-0 btm-0 mr-3 mb-3">
        <div
          @click="onSend"
          class="send-btn trans-200 bdrs-100"
          :class="inputMsg.trim().length > 0 ? 'bg-1' : 'bg-gray'"
        >
          <img src="img/send.svg" width="16" class="d-b" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ChatList from "./chat-list.vue";
import { SSE } from "sse";
import { throttle } from "../../utils/timer";

export default {
  components: {
    ChatList,
  },
  computed: {
    ...mapState({
      info: (s) => s.appInfo,
      apiKey: (s) => s.apiKey,
      noticeMsg: (s) => s.noticeMsg,
      sessionList: (s) => s.sessionList,
      sessionId: (s) => s.sessionId,
    }),
    curSession() {
      return this.sessionList.find((it) => it.id == this.sessionId);
    },
    logo() {
      return this.info.logo || "img/logo-ai.jpg";
    },
    comboList() {
      if (this.lastMsg || this.streaming) {
        return [
          ...this.msgList,
          {
            content: this.lastMsg,
            role: "assistant",
          },
        ];
      }
      return this.msgList;
    },
  },
  data() {
    return {
      inputMsg: "",
      msgList: [],
      lastMsg: "",
      streaming: false,
      isBtm: true,
    };
  },
  watch: {
    lastMsg() {
      if (this.isBtm) {
        this.$nextTick(() => {
          this.smoothToBtm(0);
        });
      }
    },
    noticeMsg({ name }) {
      if (name == "change-session") {
        this.msgList = this.getMsgList();
        this.goBtm();
      } else if (name == "abort-chat") {
        this.lastSource.close();
      }
    },
    streaming(val) {
      this.$setState({
        streamingId: val ? this.sessionId : -1,
      });
    },
  },
  mounted() {
    this.msgList = this.getMsgList();
    if (!this.msgList.length) {
      let msg = "Hello! How can I assist you today?";
      if (!this.apiKey) {
        msg = "Please config API Key [here](#/config)";
      }
      this.pushMsg(msg, 2);
    } else {
      this.goBtm();
    }
  },
  methods: {
    goBtm() {
      setTimeout(() => {
        this.smoothToBtm(0);
      }, 200);
    },
    getMsgList() {
      const id = this.sessionId;
      const list = JSON.parse(localStorage["msgList" + id] || "[]");
      return list;
    },
    onScroll(e) {
      this.isBtm =
        e.target.scrollTop >=
        e.target.scrollHeight - e.target.offsetHeight - 40;
    },
    smoothToBtm(delay = 300, behavior = "smooth") {
      const el = this.$refs.chatList;
      if (!delay) {
        el.scrollTo({
          top: el.scrollHeight,
        });
        return;
      }
      throttle(() => {
        console.log("to btm");
        el.scrollTo({
          top: el.scrollHeight,
          behavior,
        });
      }, delay)();
    },
    onSend() {
      // if (!this.apiKey) {
      //   return;
      // }
      let msg = this.inputMsg.trim();
      if (!msg) return;
      this.isBtm = true;
      this.inputMsg = "";
      if (this.lastSource) {
        this.lastSource.close();
      }
      setTimeout(() => {
        this.pushMsg(msg);
        this.smoothToBtm(30);
        this.onPost();
      }, 10);
    },
    onPost() {
      try {
        this.streaming = true;
        const body = this.getPayload(this.apiKey, this.msgList.slice(-10));
        const source = new SSE(
          "https://api.openai.com/v1/chat/completions",
          body
        );
        source.addEventListener("message", (e) => {
          if (e.data != "[DONE]") {
            const json = JSON.parse(e.data);
            // console.log(json);
            const text = json.choices[0].delta?.content || "";
            this.lastMsg = this.lastMsg + text;
          } else {
            this.pushMsg(this.lastMsg, 2);
            this.lastMsg = "";
            this.streaming = false;
          }
        });
        source.addEventListener("error", (e) => {
          let msg = "Network Error";
          if (e.data) {
            const data = JSON.parse(e.data);
            msg = data.error.message || data.error.code;
          }
          console.log(msg, e);
          if (msg == "invalid_api_key") {
            msg = "Please config API Key [here](#/config)";
          }
          this.onErr(msg);
        });
        source.addEventListener("abort", () => {
          if (!this.streaming) {
            return;
          }
          let msg = this.lastMsg;
          if (msg) msg += "...\n\n";
          msg += "Aborted";
          this.onErr(msg);
        });
        source.stream();
        this.lastSource = source;
      } catch (error) {
        console.log(error);
        this.onErr(error.message);
      }
    },
    onErr(msg) {
      this.pushMsg(msg, 2);
      this.streaming = false;
      this.lastMsg = "";
      this.smoothToBtm(30);
    },
    pushMsg(content, role = "user") {
      if (role == 2) {
        role = "assistant";
      }
      this.msgList.push({
        content,
        role,
        // time: Date.now(),
      });
      this.storMsgList();
    },
    getPayload(apiKey, messages = [], opt = {}) {
      return {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        method: "POST",
        payload: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          temperature: 0.6,
          stream: true,
          ...opt,
        }),
      };
    },
    onClear() {
      if (this.msgList.length) {
        const val = confirm("Are you sure to clear this session?");
        if (!val) return;
      }
      this.streaming = false;
      this.inputMsg = "";
      this.msgList = [];
      this.storMsgList();
      this.$setMsg("clearMsg");
    },
    storMsgList() {
      const id = this.sessionId;
      localStorage["msgList" + id] = JSON.stringify(this.msgList);
      this.onUpdate();
    },
    onUpdate() {
      const myMsg = this.msgList.find((it) => it.role == "user");
      const data = {
        id: this.sessionId,
        msgNum: this.msgList.length,
        time: Date.now(),
      };
      if (myMsg) data.title = myMsg.content;
      this.$setMsg({
        name: "updateMsg",
        data,
      });
    },
  },
};
</script>