<template>
  <div>
    <div style="min-height: 70vh">
      <el-table size="small" :data="tableList">
        <el-table-column
          v-for="(it, i) in fields"
          :key="i"
          :prop="it.field"
          :label="it.label"
        >
          <template slot-scope="scope">
            <e-upload-status :row="scope.row" v-if="it.field == 'status'" />
            <div v-else>
              {{ scope.row[it.field] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pos-s btm-0 z-10 bg-white pa-1">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="page"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size.sync="pageSize"
        :total="list.length"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { limitLoad } from "../../utils/helper";

export default {
  props: {
    list: Array,
    path: String,
    paused: Boolean,
  },
  data() {
    return {
      fields: [
        {
          field: "name",
          label: "Name",
        },
        {
          field: "size",
          label: "Size",
        },
        {
          field: "status",
          label: "Status",
        },
      ],
      page: 1,
      pageSize: 20,
      finishNum: 0,
    };
  },
  computed: {
    totalSize() {
      const size = this.list.reduce((all, it) => all + it.size, 0);
      return this.$utils.getFileSize(size);
    },
    tableList() {
      const start = (this.page - 1) * this.pageSize;
      return this.list.slice(start, start + this.pageSize);
    },
  },
  watch: {
    paused(val) {
      console.log(val);
      if (!val) this.onStart();
    },
    finishNum(val) {
      if (val % this.pageSize == 0) {
        this.page = val / this.pageSize + 1;
      }
      if (val == this.list.length) {
        this.$emit("done");
      }
    },
  },
  mounted() {
    this.onStart();
  },
  methods: {
    async onStart() {
      try {
        const list = this.list.filter((it) => !it.finished);
        await limitLoad(list, this.onUpload);
        console.log("done");
      } catch (error) {
        console.log(error.message);
      }
    },

    async onUpload(row) {
      if (this.paused) throw new Error("user paused");
      try {
        const name = this.path + row.name;

        await this.$store.dispatch("s3/multipartUpload", {
          name,
          file: row.file,
          opt: {
            progress: (p) => {
              //, point, res
              console.log(p);
              this.$set(row, "progress", Math.floor(p * 100));
            },
          },
        });
        this.$set(row, "progress", 100);
      } catch (error) {
        console.log(error);
        this.$set(row, "error", error.message);
      }
      this.$set(row, "finished", true);
      this.finishNum += 1;
    },
  },
};
</script>