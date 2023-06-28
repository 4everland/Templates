<template>
  <div class="project-header al-c space-btw">
    <div class="info al-c cursor-p" @click="handleClick">
      <el-image
        :src="projectInfo.avatar"
        fit="cover"
        class="al-c f-center"
        style="width: 40px; height: 40px; border-radius: 50%"
      >
        <div slot="placeholder" class="image-slot">
          <loading-cpm></loading-cpm>
        </div>
        <div slot="error" class="image-slot fz-14" style="height: 100%">
          <img
            width="100%"
            src="@/assets/avatar.svg"
            alt=""
            style="border-radius: 50%"
          />
        </div>
      </el-image>
      <span class="proj-name fz-18">{{ projectInfo.websiteName }}</span>
    </div>
    <el-input v-model="searchKey" @input="onInput" style="width: 30%">
      <template slot="suffix">
        <i class="el-icon-search search-icon"></i>
      </template>
    </el-input>
  </div>
</template>

<script>
import LoadingCpm from "@/components/loading-cpm.vue";
import { mapState } from "vuex";
export default {
  components: {
    LoadingCpm,
  },
  data() {
    return {
      searchKey: "",
    };
  },
  computed: {
    ...mapState({
      projectInfo: (s) => s.projectInfo,
    }),
  },
  methods: {
    onInput(val) {
      this.$emit("onKeyword", val);
    },
    handleClick() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .project-header,
  .resolve-result {
    padding: 20px !important;
  }
}
::v-deep .el-input input {
  border-radius: 50px;
}
.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #1e50ff;
  font-size: 18px;
}
.project-header {
  padding: 12px 64px;
  background: no-repeat url("@/assets/bg.png");
  background-size: 100%;
  background-position-y: 50%;
  .info {
    .proj-name {
      margin-left: 10px;
      font-weight: bold;
    }
  }
}
</style>
