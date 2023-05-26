<template>
  <div class="home" v-if="config">
    <div class="head">
      <div
        class="banner"
        :style="
          config.Banner[0].value
            ? 'background-image: url(' + config.Banner[0].value + ');'
            : ''
        "
      ></div>
      <div class="info">
        <div class="container">
          <div class="avatar">
            <img
              :src="
                config.Avatar[0].value
                  ? config.Avatar[0].value
                  : require('@/assets/head.png')
              "
              alt=""
            />
          </div>
          <div class="nickname">{{ config.Name[0].value }}</div>
          <div class="desc">
            {{ config.Bio[0].value }}
          </div>
          <div class="media-box">
            <template v-for="item in mediaList">
              <div
                v-if="item.link"
                :key="item.name"
                class="media-item"
                :style="{ background: `${item.color}` }"
                @click="goMedia(item.link)"
              >
                <img :src="item.icon" alt="" />
                <span>
                  {{ item.name }}
                </span>
              </div>
            </template>
            <a
              v-if="config.Email[0].value"
              :href="`mailto:${config.Email[0].value}`"
              style="text-decoration: none"
            >
              <div class="media-item" style="background: #9747ff">
                <img src="@/assets/icon_mail.png" alt="" />
                <span> Email </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div
        class="tabs"
        v-if="
          config.YouTubeContent[1].value ||
          config.MirrorContent[1].value ||
          config.TwitterContent[1].value
        "
      >
        <span class="tab" v-if="config.YouTubeContent[1].value">
          <a href="#YouTube">{{
            config.YouTubeContent[0].value || "YouTube"
          }}</a>
        </span>
        <span class="tab" v-if="config.MirrorContent[1].value">
          <a href="#Mirror">{{ config.MirrorContent[0].value || "Mirror" }}</a>
        </span>
        <span class="tab" v-if="config.TwitterContent[1].value">
          <a href="#Twitter">{{
            config.TwitterContent[0].value || "Twitter"
          }}</a>
        </span>
      </div>
      <div class="container">
        <div class="flex-block">
          <div class="flex-left">
            <div id="YouTube" v-if="config.YouTubeContent[1].value"></div>
            <div class="block vlog" v-if="config.YouTubeContent[1].value">
              <div class="title">
                {{ config.YouTubeContent[0].value || "YouTube" }}
              </div>
              <div class="aspect-video">
                <iframe
                  :src="formatYoutube(config.YouTubeContent[1].value)"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  width="100%"
                  height="100%"
                ></iframe>
              </div>
            </div>
            <div id="Mirror" v-if="config.MirrorContent[1].value"></div>
            <div class="block mirror" v-if="config.MirrorContent[1].value">
              <div class="title">
                {{ config.MirrorContent[0].value || "Mirror" }}
              </div>
              <div class="mirror-content">
                <div
                  class="mirror-item"
                  v-for="item in mirrorList"
                  :key="item.guid"
                  @click="goMedia(item.id)"
                >
                  <div class="mirror-item-content">
                    <div>
                      <div class="mirror-title">
                        {{ item.title.toString() }}
                      </div>
                      <div
                        class="mirror-desc"
                        v-html="getFirstPText(item.content.toString())"
                      ></div>
                    </div>
                    <div
                      class="mirror-item-img"
                      v-if="getFirstImg(item.content.toString())"
                    >
                      <img :src="getFirstImg(item.content.toString())" alt="" />
                    </div>
                  </div>
                  <div class="mirror-info">
                    <span style="display: flex; align-items: center"
                      ><img
                        class="mirror-heade"
                        :src="mirrorObj.feed.icon"
                        alt=""
                      />
                      <span class="mirror-nickname">{{
                        item.author.name
                      }}</span>
                    </span>
                    <span>
                      <span class="mirror-hash">
                        {{
                          mirrorObj.feed.id
                            .replace("https://mirror.xyz/", "")
                            .substring(0, 6)
                        }}
                      </span>
                      <span class="mirror-hash">{{
                        dateChange(item.updated)
                      }}</span>
                    </span>
                  </div>
                </div>
                <div class="mirror-btn">
                  <a :href="mirrorObj?.feed.id" target="_blank">
                    <button>View more on Mirror</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div id="Twitter" v-if="config.TwitterContent[1].value"></div>
          <div class="block twitter" v-if="config.TwitterContent[1].value">
            <div class="title">
              {{ config.TwitterContent[0].value || "Twitter" }}
            </div>
            <div class="twitter-box">
              <blockquote class="twitter-tweet">
                <a
                  class="twitter-timeline"
                  :href="config.TwitterContent[1].value"
                ></a>
              </blockquote>
            </div>
          </div>
        </div>
        <div
          class="empty"
          v-if="
            !config.YouTubeContent[1].value &&
            !config.MirrorContent[1].value &&
            !config.TwitterContent[1].value
          "
        >
          <img src="@/assets/empty.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import x2js from "x2js";

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      config: null,
      mediaList: [
        {
          name: "Discord",
          link: "",
          icon: require("@/assets/icon_discord.png"),
          color: "#5865F2",
        },
        {
          name: "Instagram",
          link: "",
          icon: require("@/assets/icon_ins.png"),
          color: "#000000",
        },
        {
          name: "Facebook",
          link: "",
          icon: require("@/assets/icon_fb.png"),
          color: "#1877F2",
        },
        {
          name: "Telegram",
          link: "",
          icon: require("@/assets/icon_tg.png"),
          color: "#2CA5E0",
        },
        {
          name: "Twitter",
          link: "",
          icon: require("@/assets/icon_tw.png"),
          color: "#1DA1F3",
        },
        {
          name: "Mirror",
          link: "",
          icon: require("@/assets/icon_mirror.png"),
          color: "#007AFF",
        },
        {
          name: "YouTube",
          link: "",
          icon: require("@/assets/icon_youtube.png"),
          color: "#FF0000",
        },
        {
          name: "Website",
          link: "",
          icon: require("@/assets/icon_homepage.png"),
          color: "#0E0E2C",
        },
        {
          name: "Github",
          link: "",
          icon: require("@/assets/icon_github.png"),
          color: "#24292F",
        },
        {
          name: "Medium",
          link: "",
          icon: require("@/assets/icon_medium.png"),
          color: "#000000",
        },
        {
          name: "Linkedin",
          link: "",
          icon: require("@/assets/icon_linkedIn.png"),
          color: "#0A66C2",
        },
        {
          name: "Reddit",
          link: "",
          icon: require("@/assets/icon_reddit.png"),
          color: "#FF4500",
        },
      ],
      mirrorObj: null,
      mirrorList: [],
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
          const { data } = res;
          this.config = data;
          if (data.Name[0].value) {
            document.title = data.Name[0].value;
          }
          if (data.MirrorContent[1].value) {
            this.getMirror(data.MirrorContent[1].value);
          }
          this.mediaList.forEach((item) => {
            let key = item.name;
            data[key].forEach((item2) => {
              if (item2.key == "link") {
                const isHttp = this.testHttp(item2.value);
                if (item2.value && !isHttp) {
                  return (item.link = "http://" + item2.value);
                } else {
                  return (item.link = item2.value);
                }
              }
            });
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getMirror(link) {
      this.mirrorList = [];
      const url = link.replace(
        "https://mirror.xyz",
        "https://web3.4everblog.org"
      );
      // const url = link.replace(
      //   "https://mirror.xyz",
      //   "http://localhost:8080/api"
      // );
      this.axios
        .get(url + "/feed/atom")
        .then((res) => {
          const { data } = res;
          const mirrorObj = this.xmlToJson(data);
          this.mirrorObj = mirrorObj;
          let item = mirrorObj.feed.entry;
          if (Array.isArray(item)) {
            if (item.length > 10) {
              item = item.slice(0, 10);
            }
            this.mirrorList = item;
          } else {
            this.mirrorList = [item];
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    xmlToJson(xml) {
      const $x2js = new x2js();
      return $x2js.xml2js(xml);
    },
    getFirstPText(html) {
      const pRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/;
      const pMatch = pRegex.exec(html);
      if (pMatch != null) {
        let firstPText = pMatch[1];
        return firstPText;
      }
    },
    getFirstImg(html) {
      const pRegex = /\bsrc\b\s*=\s*[\'\"]?([^\'\"]*)[\'\"]?/i;
      const pMatch = pRegex.exec(html);
      if (pMatch != null) {
        let firstImg = pMatch[1];
        return firstImg;
      }
    },
    dateChange(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    goMedia(link) {
      window.open(link);
    },
    formatYoutube(link) {
      const nStr = "https://www.youtube.com/watch?v=";
      const mStr = "https://youtu.be/";
      let v = "";
      let n = link.indexOf(nStr);
      let m = link.indexOf(mStr);
      if (n != -1) {
        v = link.replace(nStr, "");
        return "https://www.youtube.com/embed/" + v;
      } else if (m != -1) {
        v = link.replace(mStr, "");
        return "https://www.youtube.com/embed/" + v;
      } else {
        return link;
      }
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
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
}
.home {
  background-color: #f5f8f9;
  padding-bottom: 50px;
  min-height: 86vh;
  .head {
    .banner {
      background-image: url("@/assets/banner.png");
      width: 100%;
      height: 240px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .info {
      position: relative;
      background-color: #fff;
      padding-top: 112px;
      // min-height: 390px;
      padding-bottom: 48px;
      box-sizing: border-box;
      .avatar {
        width: 160px;
        height: 160px;
        // background: #ffffff;
        border-radius: 50%;
        position: absolute;
        top: -80px;
        left: 0;
        right: 0;
        margin: 0 auto;
        text-align: center;
        overflow: hidden;
        border: 12px solid rgba(236, 241, 244, 0.25);
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: block;
        }
      }
      .media-box {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 26px;
        .media-item {
          width: auto;
          height: 40px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          border-radius: 52px;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          margin: 8px;
          cursor: pointer;
        }
        img {
          width: 24px;
          margin-right: 5px;
        }
      }
      .nickname {
        font-size: 48px;
        color: #0b0817;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
      .desc {
        font-size: 16px;
        font-weight: 500;
        color: #8c8ca1;
        margin-top: 10px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        text-align: center;
      }
    }
  }
}
.main {
  .tabs {
    display: none;
  }
}

.flex-block {
  display: flex;
  margin-top: 40px;
  position: relative;
  .block {
    background-color: #fff;
    border-radius: 12px;
    padding: 40px;
    box-sizing: border-box;
  }
  .flex-left {
    margin-right: 40px;
    // min-width: 725px;
    flex: 2;
    .vlog {
      width: 100%;
      min-width: 800px;
      margin-bottom: 40px;
    }
    .mirror {
      width: 100%;
    }
  }
  .twitter {
    min-width: 430px;
    width: 100%;
    flex: 1;
    position: sticky;
    height: 2000px;
    top: -140px;
    .twitter-box {
      width: 100%;
      height: 1800px;
      overflow: scroll;
      .twitter-tweet {
      }
    }
  }
}
.title {
  font-size: 28px;
  font-weight: 400;
  color: #0e0e2c;
  padding-bottom: 32px;
  border-bottom: 1px solid #ecf1f4;
  margin-bottom: 40px;
}
.empty {
  text-align: center;
  margin-top: 175px;
  img {
    width: 300px;
  }
}
.mirror-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // max-height: 1200px;
  overflow: scroll;
  .mirror-item {
    width: 100%;
    margin: 10px 0;
    padding: 0 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    cursor: pointer;
    border-bottom: 1px solid #ecf1f4;
    .mirror-item-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .mirror-title {
      font-size: 32px;
      line-height: 36px;
      font-weight: bold;
      display: flex;
      align-items: center;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .mirror-date {
      font-size: 14px;
      font-weight: 500;
      color: #d0dae9;
      line-height: 20px;
    }
    .mirror-desc {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      font-size: 16px;
      line-height: 20px;
      font-weight: 500;
      color: #8c8ca1;
      margin: 10px 0;
    }
    .mirror-item-img {
      margin-left: 40px;
      img {
        width: 320px;
        border-radius: 8px;
      }
    }
    .mirror-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 40px;
      .mirror-heade {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      .mirror-nickname {
        font-size: 16px;
        font-weight: 500;
        color: #0e0e2c;
        margin-left: 10px;
      }
      .mirror-hash {
        padding: 4px 12px;
        background: #ffffff;
        font-size: 16px;
        font-weight: 500;
        margin-left: 10px;
        text-align: center;
        background: #ecf1f4;
        border-radius: 32px;
        color: #8c8ca1;
      }
    }
  }
  .mirror-btn {
    margin: 40px auto;
    text-align: center;
    button {
      width: 220px;
      height: 36px;
      background-color: #1d9bf0;
      border-radius: 33px;
      border: none;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
.aspect-video {
  aspect-ratio: 16 / 9;
}
#YouTube,
#Mirror,
#Twitter {
  height: 0;
}
@media (max-width: 960px) {
  .title {
    font-size: 22px;
    margin-bottom: 20px;
  }
  .main {
    .tabs {
      width: 100%;
      background-color: #fff;
      height: 50px;
      position: sticky;
      top: 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.05);
      margin-top: 10px;
      padding: 0 20px;
      box-sizing: border-box;
      z-index: 999;
      .tab {
        width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
      a {
        text-decoration: none;
        text-align: center;
        width: 100%;
        color: #6c7789;
        font-size: 16px;
      }
    }
  }

  .flex-block {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    .flex-left {
      margin-right: 0;
      .block {
        padding: 20px;
      }
      .vlog {
        margin-top: 0;
        min-width: auto;
      }
      .mirror {
        min-width: auto;
        width: 100%;
        margin-right: 0;
        margin-top: 0;
        .mirror-content {
          .mirror-item {
            .mirror-item-content {
              display: flex;
              align-items: center;
              justify-content: space-between;
              flex-direction: column;
            }
            .mirror-title {
              font-size: 16px;
            }
            .mirror-item-img {
              margin-left: 0;
            }
            .mirror-info {
              display: block;
              span {
                margin: 5px 0;
              }
              .mirror-hash {
                margin: 0 5px;
              }
            }
          }
        }
      }
    }
    .twitter {
      min-width: auto;
      width: 100%;
      // margin-top: 20px;
      .twitter-box {
        width: 100%;
        max-height: unset;
        overflow: unset;
      }
    }
  }
  .empty {
    margin-top: 85px;
    img {
      width: 200px;
    }
  }
  .mirror-content {
    width: 100%;
    justify-content: center;
    max-height: unset;
    overflow: unset;
  }
  #YouTube,
  #Mirror,
  #Twitter {
    width: 100%;
    height: 55px;
  }
}
</style>
