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
        <div class="list-box">
          <div class="item-title" v-if="mediaList.length > 0">
            <span>Name</span>
            <span>Link</span>
          </div>
          <div
            class="item-title"
            :class="mediaList.length <= 1 ? 'hidden' : ''"
          >
            <span>Name</span>
            <span>Link</span>
          </div>
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
  </div>
</template>

<script>
export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      config: null,
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
  max-width: 1280px;
  margin: 0 auto;
}
.home {
  min-height: 95vh;
  .head {
    padding-top: 160px;
    .info {
      .avatar {
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      .nickname {
        font-size: 40px;
        color: #0e0e2c;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 24px;
      }
    }
  }
  .main {
    margin-top: 60px;
    .list-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 50%;
        max-width: 630px;
        min-width: 280px;
        color: #8c8ca1;
        padding: 0 16px;
        box-sizing: border-box;
      }
      .hidden {
        visibility: hidden;
      }
      .item-img-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 50%;
        max-width: 630px;
        min-width: 280px;
        height: 64px;
        background: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.75);
        cursor: pointer;
        margin: 8px 0;
        padding: 0 16px;
        position: relative;
        box-sizing: border-box;
      }
      .partner-item-name {
        font-size: 20px;
        font-weight: 500;
        color: #0e0e2c;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 54px;
      }
      .share-icon {
        width: 20px;
      }
      .item-img-box:hover {
        background: rgba(151, 71, 255, 0.05);
        border: 1px solid rgba(151, 71, 255, 0.5);
        .partner-item-name {
          color: #9747ff;
        }
      }
    }
  }
}
@media (max-width: 960px) {
  .home {
    .head {
      padding-top: 20px;
      .info {
        .avatar {
          text-align: center;
        }
        .nickname {
          font-size: 32px;
          margin-top: 16px;
        }
      }
    }
    .main {
      margin-top: 40px;
      .list-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .item-title {
          display: none;
        }
        .item-img-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 90%;
        }
      }
    }
  }
}
</style>
