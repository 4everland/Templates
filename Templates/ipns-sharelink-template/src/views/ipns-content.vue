<template>
  <div class="project-container h-flex">
    <project-header @onKeyword="onKeyword"></project-header>
    <div class="resolve-result flex-1">
      <div class="control-bar al-c space-btw">
        <div class="all-checked">
          <span style="color: #8c8ca1">{{
            !this.list.length ? "Loading..." : this.list.length + " items"
          }}</span>
        </div>
        <div class="right-bar al-c">
          <img
            width="32"
            class="pr-2"
            v-show="layout == 'grid'"
            @click="layout = 'grid'"
            src="../assets/control/grid-active.svg"
            alt=""
          />
          <img
            width="32"
            class="pr-2"
            v-show="layout == 'list'"
            @click="layout = 'grid'"
            src="../assets/control/grid.svg"
            alt=""
          />

          <img
            width="32"
            v-show="layout == 'list'"
            @click="layout = 'list'"
            src="../assets/control/list-active.svg"
            alt=""
          />
          <img
            width="32"
            @click="layout = 'list'"
            v-show="layout == 'grid'"
            src="../assets/control/list.svg"
            alt=""
          />
        </div>
      </div>
      <div v-if="list.length">
        <keep-alive>
          <component
            :is="layout == 'grid' ? gridLayout : listLayout"
            :list="list"
          ></component>
        </keep-alive>
      </div>
      <div v-else class="loading al-c f-center h-flex">
        <img src="../assets/empty.png" width="250" alt="" />
        <div class="fz-14 mt-2 loading-tip">
          Fetching the resource from IPFS may take some time, please be patient.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapState } from "vuex";
var { pathToRegexp } = require("path-to-regexp");
import ReadRootCID from "@/utils/readRootCid";
import projectHeader from "@/components/project-header/project-header.vue";
import listLayout from "@/components/list-layout/list-layout.vue";
import gridLayout from "@/components/grid-layout/grid-layout.vue";
export default {
  components: {
    projectHeader,
  },
  data() {
    return {
      offset: 0,
      loading: false,
      reader: null,
      cid: null,
      loadingInstance: null,
      layout: "grid",
      searchKey: "",
      listLayout: listLayout,
      gridLayout: gridLayout,
    };
  },
  computed: {
    ...mapState({
      hasMore: (s) => s.reader.hasMore,
      dir: (s) => s.reader.dir,
      projectInfo: (s) => s.projectInfo,
    }),
    ipfsGateway() {
      console.log(this.projectInfo.ipfsGateway);
      if (this.projectInfo && this.projectInfo.ipfsGateway) {
        let ipfsGateway = this.projectInfo.ipfsGateway.trim();
        let i = ipfsGateway.lastIndexOf("/");
        if (i == ipfsGateway.length - 1) return ipfsGateway + "ipfs/";
        return ipfsGateway + "/ipfs/";
      }
      return "https://ipfs.4everland.io/ipfs/";
    },
    list() {
      let reg = new RegExp(this.searchKey);
      return this.dir.filter((it) => {
        if (it && (it.name || it.Name)) {
          return reg.test(it.name || it.Name);
        }
        return false;
      });
    },
  },
  created() {
    this.readCid();
  },
  methods: {
    readCid() {
      let re = pathToRegexp("/ipfs/:cid+");
      let match = re.exec(this.$route.path);
      let arr = match[1].split("/");
      this.cid = arr[arr.length - 1];
      this.initPage();
    },
    async initPage() {
      try {
        let reader = new ReadRootCID(this.cid, this.ipfsGateway);
        this.$store.commit("SET_READER", reader);
        await this.$store.dispatch("getReaderList");
      } catch (err) {
        console.log(err);
        this.$message(err.message);
      }
    },
    onKeyword(keyword) {
      this.searchKey = keyword;
    },
  },
  watch: {
    $route(to, from) {
      this.readCid();
    },
  },
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .resolve-result {
    padding: 20px !important;
  }
  .right-bar {
    padding: 0 !important;
    border: none !important;
  }
}
.project-container {
  width: 100%;
  height: 100%;
  .resolve-result {
    box-sizing: border-box;
    padding: 20px 64px;
    .right-bar {
      padding: 8px 12px;
      border: 1px solid rgba(140, 140, 161, 0.25);
      border-radius: 38px;
      > img {
        cursor: pointer;
      }
    }

    .loading {
      height: calc(100% - 62.5px);

      .loading-tip {
        color: #8c8ca1;
      }
    }
  }
}
</style>
