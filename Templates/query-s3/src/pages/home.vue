<style lang="scss">
.add-bucket-form {
  .el-form-item__label {
    padding-right: 18px;
  }
}
</style>

<template>
  <div>
    <el-dialog
      title="Add Bucket"
      :visible.sync="showAdd"
      append-to-body
      :width="asMobile ? '90%' : '600px'"
    >
      <div class="pa-1 add-bucket-form">
        <el-form :model="form" ref="form" size="small" label-width="100px">
          <el-form-item label="Platform">
            <el-radio v-model="form.plat" label="4everland">4EVERLAND</el-radio>
          </el-form-item>
          <template v-if="form.plat == '4everland'">
            <el-form-item label="API Key">
              <el-input v-model="form.accessKeyId" clearable></el-input>
              <el-link
                href="https://dashboard.4everland.org/bucket/access-keys"
                type="primary"
                target="_blank"
                >Get API Key</el-link
              >
            </el-form-item>
            <el-form-item label="API Secrect">
              <el-input
                v-model="form.secretAccessKey"
                clearable
                :disabled="!!info.apiKey && form.accessKeyId == info.apiKey"
              ></el-input>
            </el-form-item>
          </template>

          <el-form-item label="Bucket" v-show="apiBuckets.length">
            <el-checkbox-group v-model="checkBuckets">
              <el-checkbox
                :label="name"
                v-for="name in apiBuckets"
                :key="name"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item class="mt-7">
            <el-button
              size="small"
              :loading="apiChecking"
              @click="checkApi()"
              :disabled="posting"
              >{{ apiChecked ? "Checked" : "Check" }}</el-button
            >
            <el-button
              size="small"
              type="primary"
              :disabled="!apiChecked || !checkBuckets.length"
              :loading="posting"
              @click="onSubmit"
              >Confirm</el-button
            >
          </el-form-item>
        </el-form>
        <div class="mt-8"></div>
      </div>
    </el-dialog>

    <div class="pa-2 bdb-1 pos-r main-wrap">
      <div class="al-c">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="mini"
          @click="showAdd = true"
        >
          <span v-if="!asMobile">Bucket</span>
        </el-button>
        <div class="ml-auto">
          <a href="https://github.com/hyongnim/query-s3" target="_blank">
            <img src="img/github.svg" width="20" class="d-b pa-1" />
          </a>
        </div>
      </div>
      <div class="pos-center">
        <h2 class="fz-18">
          <span v-if="info.title">{{ info.title }}</span>
          <i v-else><span class="color-1">Q</span>uery S3</i>
        </h2>
      </div>
    </div>

    <div class="pa-4 m-auto main-wrap">
      <el-table size="small" :data="bucketList" @row-click="onRow">
        <el-table-column
          v-for="(it, i) in fields"
          :key="i"
          :prop="it.field"
          :label="it.label"
          :width="it.width"
        >
          <template slot-scope="scope">
            <el-button
              type="plain"
              style="padding: 4px 6px"
              size="mini"
              v-if="it.field == 'bucket'"
            >
              {{ scope.row.bucket.cutStr(asMobile ? 12 : 15, 2) }}
            </el-button>
            <div v-else-if="it.field == 'act'">
              <el-button
                type="text"
                size="mini"
                @click.stop="onDel(scope.$index)"
                >Remove</el-button
              >
            </div>
            <div v-else-if="it.field == 'plat'">
              <div class="mb-1">
                <el-tooltip
                  :content="
                    `${scope.row.import ? 'Imported' : 'Added'} at ` +
                    new Date(scope.row.createAt).toNiceTime(nowDate)
                  "
                  v-if="scope.row.createAt"
                  placement="right"
                >
                  <span class="d-ib">{{ scope.row.plat.toUpperCase() }}</span>
                </el-tooltip>
              </div>
              <div class="d-flex lh-12">
                <span class="gray-a">
                  {{ scope.row.accessKeyId }}
                </span>
                <i
                  v-clipboard="scope.row.accessKeyId"
                  @success="$message.success('Copied')"
                  class="el-icon-document-copy pa-1 pt-0 ml-1 hover-1"
                  @click.stop
                ></i>
              </div>
            </div>
            <div v-else>
              {{ scope.row[it.field] }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Axios from "axios";

const initForm = {
  plat: "4everland",
  bucket: "",
  accessKeyId: "",
  secretAccessKey: "",
};
export default {
  computed: {
    ...mapState({
      asMobile: (s) => s.asMobile,
      nowDate: (s) => s.nowDate,
      bucketList: (s) => s.bucketList,
    }),
  },
  data() {
    return {
      info: {},
      showAdd: false,
      form: initForm,
      checkBuckets: [],
      apiBuckets: [],
      apiChecking: false,
      apiChecked: false,
      posting: false,
      fields: [
        {
          field: "bucket",
          label: "Bucket",
        },
        {
          field: "plat",
          label: "Platform",
        },
        {
          field: "act",
          label: "Action",
          width: "60px",
        },
      ],
    };
  },
  watch: {
    bucketList(val) {
      localStorage.bucketList = JSON.stringify(val);
    },
    "form.plat"() {
      this.checkBuckets = [];
      this.apiChecked = false;
    },
    "form.accessKeyId"(val) {
      this.apiChecked = false;
      this.checkBuckets = [];
      this.apiBuckets = [];
      this.form.secretAccessKey =
        val == this.info.apiKey ? this.info.apiSecret : "";
    },
  },
  mounted() {
    this.getConfig();
  },
  methods: {
    async getConfig() {
      let url = "./config.json";
      if (/localhost/.test(location.host)) {
        // url = "./test.json";
      }
      try {
        const {
          data: { config },
        } = await Axios.get(url);
        const info = {};
        for (const row of config) {
          const arr = row.options;
          for (const row of arr) {
            info[row.key] = row.value;
          }
        }
        // console.log(info);
        this.info = info;
        if (info.apiKey) {
          this.form = {
            ...initForm,
            accessKeyId: info.apiKey,
            secretAccessKey: info.apiSecret,
          };
          const inList = this.bucketList.find(
            (it) => it.accessKeyId == info.apiKey
          );
          if (!inList) {
            this.showAdd = true;
            this.checkApi();
          }
        }
        if (info.title) {
          document.title = info.title;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async onDel(i) {
      const it = this.bucketList[i];
      try {
        await this.$confirm(`Are you sure to remove ${it.bucket} ?`);
        this.bucketList.splice(i, 1);
      } catch (error) {
        //
      }
    },
    onRow(it) {
      // console.log(it);
      this.$router.push(`/list/${it.plat}/${it.bucket}`);
    },
    async onSubmit() {
      const form = {
        ...this.form,
      };
      // console.log(form);
      try {
        this.posting = true;
        await this.checkApi();
        if (!this.apiChecked) throw new Error("Test failed");
        const added = [],
          oldArr = [];
        for (const bucket of this.checkBuckets) {
          const old = this.bucketList.filter(
            (it) => it.plat == form.plat && it.bucket == bucket
          )[0];
          if (old) {
            oldArr.push(bucket);
            continue;
          }
          added.push(bucket);
          this.bucketList.push({
            ...this.s3Opts,
            bucket,
            createAt: Date.now(),
          });
        }
        if (added.length) {
          this.showAdd = false;
          this.form = {
            ...initForm,
          };
          this.checkBuckets = [];
        } else if (oldArr.length) {
          this.$message("Already exist：" + oldArr.join(", "));
        }
      } catch (error) {
        console.log(error);
      }
      this.posting = false;
    },
    async checkApi() {
      let msg = "";
      try {
        const form = { ...this.form };
        const { plat } = form;
        if (plat == "4everland") {
          if (!form.accessKeyId) msg = "API Key required";
          else if (!form.secretAccessKey) msg = "API Secret required";
          if (msg) throw new Error(msg);
          if (!this.posting) this.apiChecking = true;
          this.s3Opts = {
            ...form,
            type: "s3",
          };
          const s3 = await this.$store.dispatch("s3/getClient", this.s3Opts);
          const data = await s3.listBuckets({});
          const infoBuckets = this.info.bucketName
            ? this.info.bucketName.split(",")
            : [];
          this.apiBuckets = data.Buckets.map((it) => {
            return it.Name;
          });
          if (form.accessKeyId == this.info.apiKey && infoBuckets.length) {
            this.apiBuckets = this.apiBuckets.filter((name) => {
              return infoBuckets.includes(name);
            });
          }
          if (
            !this.posting ||
            this.apiBuckets.filter((name) => this.checkBuckets.includes(name))
              .length == 0
          ) {
            this.checkBuckets = [...this.apiBuckets];
          }
          if (this.checkBuckets.length) {
            this.apiChecked = true;
          } else {
            throw new Error("No Bucket found");
          }
        }
      } catch (error) {
        this.apiChecked = false;
        if (error) {
          let msg = error.message || "error";
          if (msg.length > 15) this.$alert(msg);
          else this.$message(msg);
        }
      }
      this.apiChecking = false;
    },
  },
};
</script>