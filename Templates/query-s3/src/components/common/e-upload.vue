
<template>
  <div>
    <div class="e-upload">
      <div class="al-c pa-3 ml-2">
        <slot name="btn"></slot>
        <template v-if="!showClear">
          <div class="pos-r">
            <el-button
              @click="$refs.input.click()"
              type="primary"
              size="mini"
              icon="el-icon-document-add"
              >Choose Files</el-button
            >
            <input
              ref="input"
              multiple
              type="file"
              :accept="accept"
              class="pos-mask op-0 z--1"
              @input="onInput"
            />
          </div>
          <div class="ml-3 pos-r" v-if="!asMobile">
            <el-button
              @click="$refs.input2.click()"
              size="mini"
              icon="el-icon-folder-add"
              >Choose Directory</el-button
            >
            <input
              ref="input2"
              multiple
              webkitdirectory
              type="file"
              :accept="accept"
              class="pos-mask op-0 z--1"
              @input="onInput"
            />
          </div>
        </template>
        <div class="ml-3" v-else-if="!disabled">
          <el-button size="mini" @click="onClear"> Reset </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    accept: {
      type: String,
      default: "*", //image/*
    },
    disabled: Boolean,
  },
  data() {
    return {
      showClear: false,
    };
  },
  computed: {
    asMobile() {
      return this.$store.state.asMobile;
    },
  },
  mounted() {
    document.ondragover = (ev) => {
      ev.preventDefault();
    };
    document.ondrop = async (ev) => {
      ev.preventDefault();
      if (this.disabled) return;
      const files = await this.scanFiles(ev.dataTransfer);
      this.getFiles(files);
    };
    document.onpaste = async (ev) => {
      if (this.disabled) return;
      const files = await this.scanFiles(ev.clipboardData);
      this.getFiles(files);
    };
  },
  methods: {
    onInput(e) {
      // console.log(e);
      this.getFiles(e.target.files);
      const { input, input2 } = this.$refs;
      input.value = null;
      if (input2) input2.value = null;
    },
    onClick() {
      this.$refs.file.click();
    },
    async scanFiles(e) {
      const { items = [], files = [] } = e;
      const [item] = items;
      if (!item || !item.webkitGetAsEntry) return files;
      const entry = item.webkitGetAsEntry();
      if (!entry) return files;
      return entry.isFile ? files : this.getEntryDirectoryFiles(entry);
    },
    async getEntryDirectoryFiles(entry) {
      let res = [];
      var internalProces = (item, path, res) => {
        if (item.isFile) {
          return new Promise((resolve) => {
            item.file((file) => {
              file.path = path + file.name;
              var newFile = new File([file], file.path, { type: file.type });
              res.push(newFile);
              resolve(res);
            });
          });
        } else if (item.isDirectory) {
          return new Promise((resolve, reject) => {
            var dirReader = item.createReader();
            dirReader.readEntries(async (entries) => {
              for (let i = 0; i < entries.length; i++) {
                await internalProces(entries[i], path + item.name + "/", res);
              }
              resolve(res);
            }, reject);
          });
        }
      };
      await internalProces(entry, "", res);
      return res;
    },
    getFiles(files) {
      if (!files || !files.length) return;
      this.$emit("loading", {
        length: files.length,
      });
      const list = [];
      [].slice.call(files).forEach((it) => {
        const name = it.webkitRelativePath || it.name;
        const arr = name.split("/");
        arr.unshift("");
        //  a/b.png
        let pre = "";
        for (const i in arr) {
          const val = arr[i];
          if (i == arr.length - 1) {
            if (arr[i] == ".DS_Store") continue;
            list.push({
              pid: pre,
              label: arr[i],
              value: name,
              file: it,
            });
          } else {
            const cid = pre + "/" + val;
            if (list.filter((it) => it.cid == cid).length == 0) {
              list.push({
                cid,
                pid: pre,
                value: cid,
                label: val,
              });
            }
            pre = cid;
          }
        }
      });
      this.$emit("files", list);
      this.showClear = true;
    },
    onClear() {
      this.showClear = false;
      this.$emit("files", []);
    },
  },
};
</script>