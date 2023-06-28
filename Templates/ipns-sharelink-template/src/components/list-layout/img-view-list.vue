<template>
  <div class="al-c cursor-p" style="width: 100%">
    <div class="file al-c f-center pos-r" style="width: 100px" v-if="!loading">
      <template v-if="fileType == 'image'">
        <el-image
          :src="imgSrc"
          fit="contain"
          class="al-c f-center"
          style="width: 100px; height: 100px; border-raidus: 8px"
          @error="loadFailed = true"
          @load="loadFailed = false"
        >
          <div slot="placeholder" class="image-slot">
            <loading-cpm></loading-cpm>
          </div>
          <div slot="error" class="image-slot fz-14" style="height: 100%">
            <img src="@/assets/failed-file.svg" height="100%" alt="" />
          </div>
        </el-image>
        <i
          class="el-icon-refresh-right cursor-p pos-a"
          style="bottom: 10px; right: -10px"
          @click.stop="reloadImg"
          v-show="loadFailed"
        ></i>
      </template>

      <img
        v-else-if="fileType == 'directory'"
        src="@/assets/fold.svg"
        width="100"
        alt=""
      />
      <video
        ref="videos"
        style="width: 100px; height: 100px"
        :src="info.pathV2"
        v-else-if="fileType == 'video'"
      ></video>
      <img
        v-else-if="fileType == 'failed'"
        src="@/assets/failed-file.svg"
        width="100"
        alt=""
      />
      <img v-else src="@/assets/default-file.svg" width="100" alt="" />
    </div>

    <div class="file al-c f-center ml-4" style="width: 100px" v-else>
      <loading-cpm></loading-cpm>
    </div>
    <div class="ml-4 file-info" style="color: #0e0e2c">
      <div class="fw-b file-name">{{ info.name || info.Name }}</div>
      <div class="size mt-1 fz-14">{{ info.Tsize }}</div>
    </div>
    <div class="ml-4 mobile-copy">
      <img
        class="cursor-p"
        src="@/assets/copy.svg"
        width="20"
        alt=""
        v-clipboard:copy="info.cidPath"
        v-clipboard:success="onCopy"
      />
    </div>
  </div>
</template>

<script>
import LoadingCpm from "@/components/loading-cpm.vue";
export default {
  components: {
    LoadingCpm,
  },
  props: {
    info: {
      type: Object || undefined,
    },
  },
  data() {
    return {
      loadFailed: false,
      loading: false,
      date: "",
    };
  },
  computed: {
    imgSrc: {
      get() {
        return this.info.pathV2 + this.date;
      },
      set(date) {
        this.date = date;
      },
    },
    fileType() {
      if (this.info && this.info.mimeType && this.info.pathV2) {
        if (
          /^image/.test(this.info.mimeType) ||
          (/^application\/xml/.test(this.info.mimeType) &&
            this.info.extension == "svg")
        )
          return "image";
        if (/^video/.test(this.info.mimeType)) return "video";
        if (this.info.mimeType == "directory") return "directory";
        if (this.info.mimeType == "failed") return "failed";
      }
      return "default";
    },
    mimeType() {
      if (!this.info.mimeType) return "File";
      if (typeof this.info.mimeType == "string") return this.info.mimeType;
      return this.info.mimeType.mime;
    },
  },
  methods: {
    reloadImg() {
      this.date = "?t=" + +new Date();
    },
    onCopy() {
      this.$message({
        message: "IPFS CID copied!",
        type: "success",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .size,
  .mobile-copy {
    display: block !important;
  }
}
::v-deep .el-checkbox__label {
  display: none;
}
.mobile-copy {
  display: none;
}
.file-info {
  overflow: hidden;
}
.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
}
.size {
  display: none;
  font-size: 14px;
  color: #8c8ca1;
}
</style>
