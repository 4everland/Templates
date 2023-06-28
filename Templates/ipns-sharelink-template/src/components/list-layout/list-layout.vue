<template>
  <div>
    <div class="pc-table">
      <el-table
        :data="list"
        style="width: 100%"
        empty-text="empty"
        @row-click="handleRowClick"
      >
        <el-table-column prop="name" label="Name">
          <template slot-scope="{ row }">
            <img-view-list :info="row"></img-view-list>
          </template>
        </el-table-column>

        <el-table-column prop="fileSize" label="FileSize" width="300">
          <template slot-scope="{ row }">{{ row.Tsize }}</template>
        </el-table-column>
        <el-table-column label="CID" width="200">
          <template slot-scope="{ row }">
            <div class="al-c">
              <span class="cid">{{ row.Hash.toString().cutStr(10, 4) }}</span>
              <img
                class="ml-2 cursor-p"
                src="@/assets/copy.svg"
                width="20"
                alt=""
                @click.stop
                v-clipboard:copy="row.Hash.toString()"
                v-clipboard:success="onCopy"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mobile">
      <template v-for="(item, idx) in list">
        <img-view-list :info="item" :key="idx"></img-view-list>
      </template>
    </div>
  </div>
</template>

<script>
import { getFileSize } from "@/utils/utils";
import imgViewList from "./img-view-list.vue";
export default {
  components: {
    imgViewList,
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    getFileSize: getFileSize,
    onCopy() {
      this.$message({
        message: "IPFS CID copied!",
        type: "success",
      });
    },
    handleRowClick(row) {
      console.log(row);
      if (row.type && row.type == "directory") {
        this.$router.push("/ipfs/" + row.cidPath);
      } else {
        window.open(row.pathV1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .mobile {
    display: block !important;
  }
  .pc-table {
    display: none !important;
  }
}
.mobile {
  display: none;
}
.cid {
  width: 130px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
