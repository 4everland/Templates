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
      padding: 10px 12px;
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
      &::after {
        content: "";
        position: absolute;
        top: 16px;
        transform: rotate(45deg);
        padding: 5px;
        border-radius: 2px;
      }
    }
    &.isme {
      justify-content: end;
      .chat-msg {
        margin-left: 50px;
        background: #fff;
        color: #666;
        &::after {
          right: -4px;
          background: #fff;
        }
      }
    }
    &.notme {
      .chat-msg {
        background: #775da6;
        color: #fff;
        margin-right: 50px;
        &::after {
          left: -4px;
          background: #775da6;
        }
        a {
          color: #46f3fb;
        }
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
      <div class="m-3 mt-0 bdrs-3 chat-msg">
        <div v-html="it.msg"></div>
      </div>
      <img v-if="it.isMe" :src="avatar" class="avatar" />
    </li>
  </ul>
</template>

<script>
import MarkdownIt from "markdown-it/lib";
import Highlight from "markdown-it-highlightjs";
import "highlight.js";

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
  computed: {
    chatList() {
      return this.list.map((it) => {
        const msg = md
          .render(it.content)
          .replace(/<a\s/gm, '<a target="_blank" ');
        return {
          ...it,
          isMe: it.role == "user",
          msg,
        };
      });
    },
  },
};
</script>