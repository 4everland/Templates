<style lang="scss">
</style>

<template>
  <div class="file-list h100p h-flex">
    <e-upload
      ref="upload"
      @loading="onLoading"
      @files="onFiles"
      :disabled="uploading"
    >
      <template slot="btn" v-if="files.length">
        <div class="mr-5" v-if="!uploading">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
            >Check All</el-checkbox
          >
        </div>
        <div v-if="uploaded">
          <el-button type="primary" size="mini" @click="onCancel"
            >Upload More</el-button
          >
          <el-button size="mini" @click="onBack">Back</el-button>
        </div>
        <div v-else class="mr-3">
          <el-button
            :disabled="!checkFiles.length"
            :type="!paused ? 'info' : 'primary'"
            size="mini"
            @click="onUpload"
            >{{
              !paused
                ? "Pause"
                : uploading
                ? "Continue"
                : `Upload ${checkFiles.length} files`
            }}</el-button
          >
          <el-button size="mini" v-if="uploading && paused" @click="onCancel">
            Cancel
          </el-button>
        </div>
      </template>
    </e-upload>
    <div class="mt-2 bdt-1 ov-a flex-1" ref="panelWrap">
      <div class="mt-5 ta-c" v-if="!files.length" v-loading="loading">
        <el-empty description=" ">
          <p class="gray fz-14">
            <template v-if="asMobile">No Files</template>
            <template v-else
              ><b class="color-1">Drop or Paste</b> files or directory</template
            >
          </p>
        </el-empty>
      </div>
      <div class="pa-3 pt-1" v-else-if="uploading">
        <upload-list
          :list="checkFileList"
          :paused="paused"
          :path="path"
          @done="onUploadDone"
        />
      </div>
      <div class="d-flex h100p" v-else>
        <el-cascader-panel
          ref="panel"
          v-model="checkFiles"
          :props="config"
          :options="fileList"
          :border="false"
          @expand-change="onExpand"
          class="h100p"
        >
          <template v-slot="{ data }">
            <div
              @click="onItem(data)"
              :class="{
                'color-1 fw-b': curFile && curFile == data.file,
              }"
              :title="data.label"
            >
              <span class="fz-14">{{ data.label.cutStr(10, 6) }}</span>
            </div>
          </template>
        </el-cascader-panel>
        <div class="flex-1 shrink-0 bdl-1 h100p">
          <file-info class="h100p ovy-a" :file="curFile" @render="onRender" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toTree } from "../../utils/helper";

export default {
  props: {
    path: String,
  },
  data() {
    return {
      loading: false,
      files: [],
      checkAll: true,
      isIndeterminate: false,
      checkFiles: [],
      config: {
        multiple: true,
        leaf: true,
      },
      curFile: null,
      uploading: false,
      paused: true,
      uploaded: false,
    };
  },
  computed: {
    asMobile() {
      return this.$store.state.asMobile;
    },
    fileList() {
      const item = this.files[0];
      if (!item) return [];
      return toTree(this.files, item.cid);
    },
    checkFileList() {
      return this.checkFiles.map((it) => {
        const val = it[it.length - 1];
        const item = this.files.find((it) => it.value == val);
        return {
          name: val,
          size: this.$utils.getFileSize(item.file.size),
          file: item.file,
        };
      });
    },
  },
  watch: {
    checkAll(val) {
      this.isIndeterminate = false;
      if (!val) this.checkFiles = [];
      else {
        this.checkAllNodes();
      }
    },
    checkFiles(val) {
      this.isIndeterminate = val.length > 0 && val.length < this.allLen;
      if (!this.isIndeterminate && !this.loading) {
        this.checkAll = val.length > 0;
      }
    },
    fileList(val) {
      this.uploading = false;
      this.paused = true;
      this.checkAllNodes();
      if (val.length == 1) {
        this.curFile = this.fileList[0].file;
      }
    },
  },
  methods: {
    onUploadDone() {
      this.uploaded = true;
      this.$emit("uploaded");
    },
    onBack() {
      this.onCancel();
      this.$emit("close");
    },
    onCancel() {
      this.uploaded = false;
      this.uploading = false;
      this.paused = false;
      this.$refs.upload.onClear();
    },
    onUpload() {
      this.uploading = true;
      this.paused = !this.paused;
    },
    onLoading() {
      this.loading = true;
    },
    onRender() {
      this.onExpand();
    },
    onItem(e) {
      this.curFile = e.file;
    },
    onExpand() {
      this.$nextTick(() => {
        const { panel } = this.$refs;
        this.$refs.panelWrap.scrollTo(panel.$el.offsetWidth, 0);
      });
    },
    onFiles(val) {
      this.curFile = null;
      this.files = [];
      this.checkFiles = [];
      this.$nextTick(() => {
        this.files = val;
        this.loading = false;
      });
      this.$emit("pick", true);
    },
    checkAllNodes() {
      this.$nextTick(() => {
        if (!this.checkAll) this.checkAll = true;
        else {
          this.el_checkAllNodes();
          this.$nextTick(() => {
            this.allLen = this.checkFiles.length;
          });
        }
        this.isIndeterminate = false;
      });
    },
    el_checkAllNodes() {
      const panel = this.$refs.panel;
      if (!panel) return;
      panel
        .getFlattedNodes()
        .filter(function (node) {
          return !node.isDisabled;
        })
        .forEach(function (node, i) {
          if (i == 0) panel.handleExpand(node);
          return node.doCheck(true);
        });
      panel.calculateMultiCheckedValue();
    },
  },
};
</script>