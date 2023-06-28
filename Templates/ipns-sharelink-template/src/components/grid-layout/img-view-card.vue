<template>
  <div class="box-card cursor-p">
    <div v-if="!loading" class="file ov-h al-c f-center mt-2 pos-r">
      <template v-if="fileType == 'image'">
        <el-image
          :src="imgSrc"
          fit="contain"
          class="al-c f-center"
          style="width: 100%; height: 100%; border-raidus: 8px"
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
          style="right: 0px; bottom: 10px"
          @click.stop="reloadImg"
          v-show="loadFailed"
        ></i>
      </template>
      <img
        v-else-if="fileType == 'directory'"
        src="@/assets/fold.svg"
        height="100%"
        alt=""
      />
      <video
        ref="videos"
        style="height: 100px"
        preload="auto"
        :src="info.pathV2"
        v-else-if="fileType == 'video'"
      ></video>
      <img
        v-else-if="fileType == 'failed'"
        src="@/assets/failed-file.svg"
        height="100%"
        alt=""
      />
      <img v-else src="@/assets/default-file.svg" height="100%" alt="" />
    </div>
    <div v-else class="file al-c f-center mt-8">
      <loading-cpm></loading-cpm>
    </div>

    <div class="fz-14 ta-c mt-3">
      <p class="name">{{ info.name || info.Name }}</p>
      <p class="size">{{ info.fileSize || info.Tsize }}</p>
    </div>
  </div>
</template>

<script>
import { getFileSize } from "@/utils/utils";

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
      date: "",
      loading: false,
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
    getFileSize: getFileSize,
    reloadImg() {
      this.date = "?t=" + +new Date();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-checkbox__label {
  display: none;
}
.box-card {
  position: relative;
  margin-top: 30px;
  padding: 20px 15px;
  border-radius: 8px;
  box-sizing: border-box;
  height: 230px;
  background: rgba(140, 140, 161, 0.05);
  .file {
    height: 130px;
    font-size: 18px;
  }
}
.ipns-checkbox {
  position: absolute;
  left: 20px;
  top: 20px;
  transition: all 0.3s ease;
  opacity: 0;
}

.ipns-checkbox.checked {
  opacity: 1 !important;
}
.box-card:hover .ipns-checkbox {
  opacity: 1;
}

.box-card.checked {
  background: rgba(30, 80, 255, 0.05);
}

.name {
  margin-bottom: 5px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.size {
  font-size: 14px;
  color: #8c8ca1;
}
::v-deep .image-slot {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
