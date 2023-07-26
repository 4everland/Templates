<template>
  <div
    :class="[
      'el-row',
      this.justify !== 'start' ? `is-justify-${this.justify}` : '',
      this.align !== 'top' ? `is-align-${this.align}` : '',
      { 'el-row--flex': this.type === 'flex' },
    ]"
    :style="style"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ElRow",
  componentName: "ElRow",
  props: {
    tag: {
      type: String,
      default: "div",
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: "start",
    },
    align: {
      type: String,
      default: "top",
    },
  },
  computed: {
    style() {
      const ret = {};
      if (this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }
      return ret;
    },
  },
};
</script>
