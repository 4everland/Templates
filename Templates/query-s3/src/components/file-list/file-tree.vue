<style lang="scss">
</style>

<template>
  <div>
    <el-tree
      ref="tree"
      node-key="name"
      :default-expanded-keys="['']"
      :props="props"
      :showCheckbox="showCheckbox"
      lazy
      :load="onLoad"
      @node-click="onNode"
      @check="onCheck"
    >
      <!-- node,  -->
      <div class="flex-1 al-c pr-2 tree-node-item" slot-scope="{ node, data }">
        <i
          class="mr-2"
          :class="node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'"
          v-if="!data.leaf"
        ></i>
        <i
          class="mr-2 color-1"
          :class="
            curMarker == data.marker
              ? 'el-icon-loading'
              : 'el-icon-refresh-right'
          "
          v-if="data.marker"
        ></i>
        <span
          class="fz-14 fs-node-label"
          :class="{
            'color-1': data.marker || data.name == curName,
          }"
          >{{ data.label.cutStr(15, 8) }}</span
        >
        <i
          @click.stop="onRefresh(node)"
          class="ml-auto color-1 node-refresh"
          :class="
            curRefresh == data.name
              ? 'el-icon-loading d-b'
              : 'el-icon-refresh-right d-n'
          "
          v-if="!data.leaf && node.loaded"
        ></i>
      </div>
    </el-tree>
  </div>
</template>

<script>
import mixin from "./mixin";

export default {
  mixins: [mixin],
  props: {
    showCheckbox: Boolean,
  },
  data() {
    return {
      props: {
        label: "name",
        children: "subs",
        isLeaf: "leaf",
      },
    };
  },
  methods: {
    onCheck() {
      // const { checkedNodes, halfCheckedNodes } = obj;
      const p = this.$refs.tree;
      const checkedNodes = p.getCheckedNodes();
      const halfCheckedNodes = p.getHalfCheckedNodes();
      let dirArr = checkedNodes
        .filter((it) => {
          return (
            it.isDir &&
            !halfCheckedNodes.filter((hf) => hf.name == it.name).length
          );
        })
        .map((it) => it.name);
      this.onCheckedEmit(dirArr, checkedNodes);
    },
    async onNode(data, node) {
      const { parent } = node;
      if (data.marker) {
        // console.log(node);
        if (this.curMarker == data.marker) return;
        try {
          this.curMarker = data.marker;
          const list = await this.getFiles(parent.data.name, data.marker);
          const subs = parent.childNodes.map((it) => it.data);
          subs.pop();
          parent.setData({
            ...parent.data,
            subs: [...subs, ...list],
          });
          parent.setChecked(false);
          this.onCheck();
        } catch (error) {
          console.log(error);
        }
        this.curMarker = null;
      } else if (data.leaf) {
        this.curParent = parent;
        this.onFile(data);
      } else {
        this.curParent = node;
      }
    },
  },
};
</script>