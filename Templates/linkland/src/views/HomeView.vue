<template>
  <div class="home" v-if="config">
    <div class="head">
      <div class="info">
        <div class="container">
          <div class="avatar">
            <img
              :src="
                config.avatar ? config.avatar : require('@/assets/head.png')
              "
              alt=""
            />
            <div class="nickname">{{ config.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="container">
        <div
          v-for="(item, index) in mediaList"
          :key="index"
          class="item-img-box"
          @click="goMedia(item.linkHref)"
        >
          <div class="partner-item-name">
            {{ item.linkName }}
          </div>
          <img class="share-icon" src="@/assets/share.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      config: null,
      mediaList: [],
    };
  },
  created() {},
  mounted() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      this.axios
        .get("./config.json")
        .then((res) => {
          let configObj = {};
          let Arr = [];
          const { data } = res;
          console.log(res);
          console.log(data);
          data.config.forEach((item, index) => {
            let navObj = {};
            item.options.forEach((i) => {
              configObj[i.key] = i.value;
              if (i.key.indexOf("linkName") != -1) {
                if (i.value) {
                  navObj.linkName = i.value;
                }
              }
              if (i.key.indexOf("linkHref") != -1) {
                const isHttp = this.testHttp(i.value);
                if (i.value && !isHttp) {
                  navObj.linkHref = "http://" + i.value;
                } else {
                  navObj.linkHref = i.value;
                }
              }
            });
            Arr[index] = navObj;
          });
          if (configObj.name) {
            document.title = configObj.name;
          }
          this.config = configObj;

          this.mediaList = Arr.filter((item) => {
            if (item.linkHref) {
              return item;
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    goMedia(link) {
      console.log(link);
      window.open(link);
    },
    testHttp(link) {
      let httpRegex = /(http|https):\/\/([\w.]+\/?)\S*/;
      const httpMatch = httpRegex.exec(link);
      return httpMatch;
    },
  },
};
</script>
<style lang="less">
.container {
  max-width: 1040px;
  margin: 0 auto;
}
.home {
  min-height: 90vh;
  .head {
    .info {
      .avatar {
        text-align: center;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      .nickname {
        font-size: 24px;
        color: #0b0817;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 10px;
      }
    }
  }
  .main {
    margin-top: 60px;
    .item-img-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90%;
      max-width: 660px;
      min-width: 280px;
      height: 76px;
      background: rgba(255, 255, 255, 0.3);
      border: 1px solid #fff;
      border-radius: 8px;
      margin: 4px;
      cursor: pointer;
      margin: 20px auto;
      position: relative;
    }
    .partner-item-name {
      font-size: 16px;
      font-weight: 500;
      color: #051f30;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 45px;
    }
    .share-icon {
      width: 30px;
      position: absolute;
      right: 20px;
      display: none;
    }
    .item-img-box:hover {
      background-color: #8272d1;
      border: 1px solid #8272d1;
      .partner-item-name {
        color: #fff;
      }
      .share-icon {
        display: block;
      }
    }
  }
}
</style>
