<style lang="scss">
.chat-list {
  padding: 0;
  margin: 0;
  pre {
    white-space: pre-wrap;
    tab-size: 2;
  }
  .chat-item {
    .chat-msg {
      padding: 8px 12px;
      max-width: 460px;
      position: relative;
      font-size: 13px;
      line-height: 1.6;
      word-break: break-word;
      ol {
        padding: 5px 10px 15px 30px;
        li {
          margin-top: 10px;
        }
      }
    }
    &.isme {
      justify-content: end;
      .chat-msg {
        margin-left: 50px;
        background: #8d4bf6;
        color: #fff;
      }
    }
    &.notme {
      .chat-msg {
        background: #f2f4f7;
        color: #666;
        border: 1px solid #eee;
        margin-right: 50px;
      }
    }
  }
}
</style>

<template>
  <ul class="chat-list">
    <li
      class="d-flex mb-3 chat-item"
      :class="it.isMe ? 'isme' : 'notme'"
      v-for="(it, i) in chatList"
      :key="i"
    >
      <img v-if="!it.isMe" :src="logo" class="avatar" />
      <div class="m-3 mt-0 bdrs-10 chat-msg">
        <img
          src="img/loading.svg"
          height="22"
          class="d-b white"
          v-if="!it.msg"
        />
        <div v-else v-html="it.msg"></div>
        <div
          class="pos-a btm-0 pa-2 pb-0"
          style="right: -30px"
          v-if="it.msg && !it.isMe"
        >
          <span
            v-if="copyText == it.content"
            class="suc-1 fz-12 pos-a left-0 ml-2"
            style="top: -16px; width: 60px"
            >Copied</span
          >
          <img
            src="img/copy.svg"
            height="16"
            class="hover-1"
            @click="onCopy(it.content)"
          />
        </div>
      </div>
      <img v-if="it.isMe" :src="avatar" class="avatar" />
    </li>
  </ul>
</template>

<script>
import MarkdownIt from "markdown-it/lib";
import Highlight from "markdown-it-highlightjs";
import "highlight.js";
import useClipboard from "vue-clipboard3";

const { toClipboard } = useClipboard();

const md = MarkdownIt({
  linkify: true,
  breaks: true,
}).use(Highlight);

export default {
  props: {
    list: Array,
    logo: String,
    avatar: String,
  },
  data() {
    return {
      copyText: "",
    };
  },
  computed: {
    chatList() {
      return this.list.map((it) => {
        const msg = md
          .render(it.content)
          .replace(/<a\s/gm, '<a target="_blank" ')
          .replace('target="_blank" href="#', 'href="#');
        return {
          ...it,
          isMe: it.role == "user",
          msg,
        };
      });
    },
  },
  methods: {
    async onCopy(text) {
      try {
        await toClipboard(text);
        console.log("Copied to clipboard");
        this.copyText = text;
        if (this.timing) {
          clearTimeout(this.timing);
        }
        this.timing = setTimeout(() => {
          this.copyText = "";
        }, 1e3);
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>