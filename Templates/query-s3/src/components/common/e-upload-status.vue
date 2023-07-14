<template>
  <div>
    <el-tooltip v-if="row.error" :content="row.error" placement="top">
      <el-tag type="danger" effect="plain" size="small">Failed</el-tag>
    </el-tooltip>
    <el-tag
      v-else-if="row.progress"
      :type="row.progress == 100 ? 'success' : ''"
      size="small"
      >{{ row.progress }}%</el-tag
    >
    <el-tag v-else type="info" size="small">Pending</el-tag>
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
  },
};
</script>