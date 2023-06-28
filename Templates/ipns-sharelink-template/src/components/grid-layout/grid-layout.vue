<template>
  <el-row :gutter="20">
    <el-col
      :sm="6"
      :lg="4"
      :span="12"
      v-for="(item, index) in list"
      :key="index"
    >
      <img-view-card
        :info="item"
        @click.native="handleRowClick(item)"
      ></img-view-card>
    </el-col>
  </el-row>
</template>

<script>
import imgViewCard from "./img-view-card.vue";
export default {
  components: {
    imgViewCard,
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
    handleRowClick(item) {
      console.log(item);
      if (item.type && item.type == "directory") {
        this.$router.push("/ipfs/" + item.cidPath);
      } else {
        window.open(item.pathV1);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
