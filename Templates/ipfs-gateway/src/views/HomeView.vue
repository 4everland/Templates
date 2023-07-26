<template>
  <div class="home" ref="home">
    <div class="title">{{ projectInfo.websiteName }}</div>
    <div class="int-box">
      <img src="@/assets/img/search.png" alt="" />
      <input
        type="text"
        placeholder="IPFS CID"
        v-model="cid"
        @keyup.enter="onInput"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

// @ is an alias to /src

export default {
  name: "HomeView",
  components: {},
  computed: {
    ...mapState({
      projectInfo: (s) => s.projectInfo,
    }),
  },
  data() {
    return {
      cid: "",
      backGround: require("@/assets/img/bg.jpg"),
    };
  },
  created() {},
  mounted() {
    const backGround = this.projectInfo.background;
    if (backGround) {
      this.backGround = backGround;
    }
    this.$refs.home.style.backgroundImage = `url(${this.backGround})`;
  },
  methods: {
    onInput() {
      if (!this.cid) {
        return;
      }
      this.$router.push(`/ipfs/${this.cid}`);
    },
  },
};
</script>
<style lang="less">
.home {
  width: 100%;
  height: 100vh;
  // background-image: url("@/assets/img/bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .title {
    display: -webkit-box;
    width: 640px;
    flex-shrink: 0;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: Helvetica;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-bottom: 18px;
  }
  .int-box {
    display: flex;
    width: 640px;
    height: 48px;
    padding: 12px;
    align-items: center;
    gap: 12px;
    border-radius: 94px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    background: rgba(0, 0, 0, 0.25);
    box-sizing: border-box;
    img {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }
    input {
      width: 100%;
      outline: none;
      border: none;
      background-color: transparent;
      color: #fff;
      font-size: 16px;
      font-weight: 400;
    }
    input::-webkit-input-placeholder {
      color: #fff;
      opacity: 0.5;
    }
    input:-moz-placeholder {
      color: #fff;
      opacity: 0.5;
    }
    input::-moz-placeholder {
      color: #fff;
      opacity: 0.5;
    }
    input:-ms-input-placeholder {
      color: #fff;
      opacity: 0.5;
    }
  }
}
</style>
