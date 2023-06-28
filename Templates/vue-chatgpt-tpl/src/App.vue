<style lang="scss">
body {
  min-height: 100vh;
  padding-top: 40px;
  background: linear-gradient(135deg, #f7edff 0%, #f7edff 30%, #cdd8e9 100%);
}
.bg-chat {
  margin: 0 auto;
  width: 74vw;
  height: 82vh;
  max-width: 1500px;
  max-height: 1200px;
  min-width: 700px;
  box-shadow: 0px 2px 4px #b0b0b047;
  border-radius: 14px;
}
// @media screen and (max-width: ) {}
.left-nav {
  min-width: 200px;
  max-width: 290px;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.75),
      rgba(255, 255, 255, 0.75)
    ),
    rgba(151, 71, 255, 0.2);
}
.avatar {
  display: block;
  $size: 40px;
  width: $size;
  height: $size;
  border-radius: 100px;
  object-fit: cover;
}
</style>

<template>
  <div style="min-width: 800px">
    <div class="d-flex bg-white bg-chat ov-h">
      <div class="left-nav flex-1 h100p h-flex">
        <div class="mt-2 al-c pa-3">
          <img :src="logo" class="mr-2 avatar" />
          <div class="mr-auto flex-1 shrink-1">
            <h2 class="fz-16">{{ info.title || "ChatGPT Demo" }}</h2>
            <p class="gray fz-12 line-2" v-if="info.bio">
              {{ info.bio }}
            </p>
          </div>
        </div>
        <div class="flex-1 ov-a pa-3">
          <session-list></session-list>
        </div>
        <div class="pa-3 al-c">
          <a
            class="btn-wrap active text"
            :href="info.btnLink"
            target="_blank"
            v-if="info.btnLink"
          >
            <span class="color-1">{{ info.btnName || "Link" }}</span>
          </a>
          <router-link
            class="btn-wrap d-ib ml-auto"
            :class="{
              active: $route.path == '/config',
            }"
            to="/config"
          >
            <img src="img/key.svg" width="12" class="d-b" />
          </router-link>
        </div>
      </div>
      <div class="flex-2">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>

    <btm-links></btm-links>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Axios from "axios";
import BtmLinks from "./components/btm-links.vue";
import SessionList from "./components/session-list.vue";

export default {
  components: {
    BtmLinks,
    SessionList,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      info: (s) => s.appInfo,
    }),
    logo() {
      return this.info.logo || "img/logo-ai.jpg";
    },
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      try {
        const {
          data: { config },
        } = await Axios.get("./config.json");
        const info = {};
        for (const row of config) {
          const arr = row.options;
          for (const row of arr) {
            info[row.key] = row.value;
          }
        }
        console.log(info);
        // this.info = info;
        const obj = {
          appInfo: info,
        };
        if (info.apiKey) {
          obj.apiKey = info.apiKey;
        }
        this.$setState(obj);

        if (info.title) {
          document.title = info.title;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>