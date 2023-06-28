<style lang="scss">
.sess-list {
  margin: 0;
  padding: 0;
  li {
    padding: 10px 12px;
    list-style: none;
    margin-bottom: 18px;
  }
}
</style>

<template>
  <div>
    <ul class="sess-list">
      <li
        @click="onItem(it)"
        class="btn-wrap"
        :class="{
          active: it.id == sessionId && $route.path == '/',
        }"
        v-for="it in list"
        :key="it.id"
      >
        <div class="color-1">{{ it.title }}</div>
        <div class="al-c fz-12 gray">
          <span class="mr-2"
            >{{ it.msgNum || 0 }} message{{ it.msgNum != 1 ? "s" : "" }}</span
          >
          <span class="ml-auto"> {{ new Date(it.time).format() }} </span>
        </div>
      </li>
      <li class="btn-wrap al-c f-center" @click="onAdd">
        <img src="img/add.svg" width="16" />
        <span class="fz-15 ml-1">New Chat</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      list: (s) => s.sessionList,
      noticeMsg: (s) => s.noticeMsg,
      sessionId: (s) => s.sessionId,
      streamingId: (s) => s.streamingId,
    }),
  },
  created() {
    if (!this.list.length) {
      this.onAdd();
    }
  },
  watch: {
    noticeMsg({ name, data }) {
      if (name == "clearMsg") {
        this.onClear();
      } else if (name == "updateMsg") {
        const list = [...this.list];
        const item = list.find((it) => it.id == data.id);
        Object.assign(item, data);
        this.$setStore({
          sessionList: list,
        });
      }
    },
  },
  methods: {
    async onItem(it) {
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
      if (this.streamingId > -1 && this.streamingId != it.id) {
        const val = confirm("Are you sure to abort this chat session?");
        if (!val) return;
        this.$setMsg("abort-chat");
        await this.$sleep(300);
      }
      this.$setMsg("change-session");
      this.$setStore({
        sessionId: it.id,
      });
      this.$emit("close");
    },
    onAdd() {
      if (this.list.length >= 5) {
        return alert("Limit 5 to maximum");
      }
      const ids = this.list.map((it) => it.id);
      const maxId = Math.max(-1, ...ids);
      const id = maxId + 1;
      const item = {
        id,
        title: "New Conversation",
        time: Date.now(),
      };
      this.$setStore({
        sessionList: [...this.list, item],
      });
      this.onItem(item);
    },
    onClear() {
      let idx = 0;
      this.list.forEach((it, i) => {
        if (it.id == this.sessionId) idx = i;
      });
      const list = [...this.list];
      list.splice(idx, 1);
      this.$setStore({
        sessionList: list,
      });
      localStorage.removeItem("msgList" + this.sessionId);
      if (this.list.length) {
        idx = idx == 0 ? 0 : idx - 1;
        this.onItem(this.list[idx]);
      } else {
        this.onAdd();
      }
    },
  },
};
</script>