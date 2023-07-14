<template>
  <div id="detail">
    <div class="header">
      <div class="header-container">
        <div class="name">{{ projectInfo.websiteName }}</div>
        <div class="int-box">
          <img src="@/assets/img/search-dark.png" alt="" />
          <input
            type="text"
            placeholder="IPFS CID"
            v-model="cid"
            @keyup.enter="onInput"
          />
        </div>
      </div>
    </div>
    <div class="body">
      <div class="left-ad" v-html="projectInfo.leftAd"></div>
      <div class="main">
        <div class="top-ad" v-html="projectInfo.topAd"></div>
        <div class="table">
          <div class="table-head">
            <div class="Status">Online</div>
            <div class="Link">IPFS</div>
            <div class="Flag">Country</div>
            <div class="Took">Time</div>
            <div class="Download">Download</div>
          </div>
          <div class="table-body">
            <div
              class="table-line"
              v-for="(item, index) in ipfsGatewayList"
              :key="index"
            >
              <div class="Status">
                <img
                  v-if="item.status"
                  src="@/assets/img/onLine.png"
                  alt=""
                  width="24"
                />
                <img v-else src="@/assets/img/offLine.png" alt="" width="24" />
              </div>
              <div class="Link">{{ item.link }}</div>
              <div class="Flag"><img :src="item.flag" alt="" width="16" /></div>
              <div class="Took">{{ item.took ? item.took + "s" : "" }}</div>
              <div class="Download">
                <img
                  v-if="item.status"
                  src="@/assets/img/download.png"
                  alt=""
                  width="24"
                  @click="toIpfs(item.url)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-ad" v-html="projectInfo.bottomAd"></div>
      </div>
      <div class="right-ad" v-html="projectInfo.rightAd"></div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";

import { TokenBucketLimiter } from "@dutu/rate-limiter";
import { lookup as IpfsGeoIpLookup } from "ipfs-geoip";

// @ is an alias to /src
const DEFAULT_IPFS_GATEWAY = "https://ipfs.io";
const googleLimiter = new TokenBucketLimiter({
  bucketSize: 1,
  tokensPerInterval: 1,
  interval: 1000 * 2,
  stopped: true,
});
const cloudFlareLimiter = new TokenBucketLimiter({
  bucketSize: 1,
  tokensPerInterval: 1,
  interval: 1000 * 2,
  stopped: true,
});
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
      ipfsList: [],
      ipfsGatewayList: [],
    };
  },
  created() {
    this.cid = this.$route.params.cid;
    this.ipfsList = this.projectInfo.ipfsGateway.map((item) => {
      item.ipfs = item.ipfs.replace(/\s*/g, "");
      const isHttp = this.testHttp(item.ipfs);
      if (!isHttp) {
        item.ipfs = "https://" + item.ipfs;
      }
      const urlObj = this.getLocation(item.ipfs);
      item.ipfs = urlObj.origin;
      return item.ipfs;
    });
  },
  mounted() {
    this.checkList();
  },
  methods: {
    onInput() {
      if (!this.cid) {
        return;
      }
      this.$router.push(
        `/ipfs/${this.cid}`,
        () => {},
        () => {}
      );
      this.checkList();
    },
    async getFlag(hostname) {
      let ask = true;
      try {
        const savedSTR = localStorage.getItem(hostname);
        if (savedSTR != null) {
          const saved = JSON.parse(savedSTR);
          const now = Date.now();
          const savedTime = saved.time;
          const elapsed = now - savedTime;
          const expiration = 7 * 24 * 60 * 60 * 1000; // 7 days
          if (elapsed < expiration) {
            ask = false;
            return this.onResponse(saved);
          }
        }
      } catch (e) {
        throw e;
      }
      if (ask) {
        this.startLimiters();
        const url = await this.waitForAvailableEndpoint(hostname);
        return await this.dnsRequest(url, hostname);
      }
    },
    startLimiters() {
      if (googleLimiter.isStopped === true) {
        googleLimiter.start();
      }
      if (cloudFlareLimiter.isStopped === true) {
        cloudFlareLimiter.start();
      }
    },
    async checker(hostname, cid) {
      const { host } = this.getLocation(hostname);
      const flag = await this.getFlag(host);
      let startTime = Date.now();
      let url = hostname + "/ipfs/" + cid;
      let Obj = {
        status: "",
        link: host,
        flag: flag,
        took: "",
        url: url,
        time: "",
      };
      await this.axios
        .get(url)
        .then((res) => {
          let endTime = Date.now();
          let time = endTime - startTime;
          const s = (time / 1000).toFixed(2);
          Obj.status = true;
          Obj.time = time;
          Obj.took = s;
        })
        .catch((err) => {
          Obj.status = false;
        })
        .finally(() => {});
      return Obj;
    },
    async checkList() {
      this.ipfsGatewayList = [];
      let successList = [];
      let failedList = [];
      this.ipfsList.forEach(async (i) => {
        const res = await this.checker(i, this.cid);
        if (res.status) {
          successList.push(res);
          successList = this.sortArr(successList);
        } else {
          failedList.push(res);
        }
        let newArr = [...successList, ...failedList];
        this.ipfsGatewayList = newArr;
      });
    },
    async waitForAvailableEndpoint(hostname) {
      const url = await Promise.race([
        googleLimiter
          .awaitTokens(1)
          .then(() => googleLimiter.tryRemoveTokens(1))
          .then((tokenAvailable) => {
            if (tokenAvailable) {
              return `https://dns.google/resolve?name=${hostname}&type=A`;
            }
          }),
        cloudFlareLimiter
          .awaitTokens(1)
          .then(() => cloudFlareLimiter.tryRemoveTokens(1))
          .then((tokenAvailable) => {
            if (tokenAvailable) {
              return `https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`;
            }
          }),
      ]);
      if (url == null) {
        // No available tokens...
        console.log(
          "we awaited tokens, but could not retrieve any.. restarting dnsRequest"
        );
        return this.waitForAvailableEndpoint(hostname);
      } else {
        return url;
      }
    },
    async dnsRequest(url, hostname) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/dns-json",
          },
        });
        const responseJson = await response.json();
        return await this.handleDnsQueryResponse(responseJson, hostname);
      } catch (err) {
        console.log("problem submitting DNS request", url, err);
      }
    },
    async handleDnsQueryResponse(response, hostname) {
      if (response.Answer == null) {
        // console.log(
        //   'Response does not contain the "Answer" property:',
        //   response
        // );
        return;
      }
      let ip = null;
      for (let i = 0; i < response.Answer.length && ip == null; i++) {
        const answer = response.Answer[i];
        if (answer.type === 1) {
          ip = answer.data;
        }
      }
      if (ip != null) {
        try {
          const geoipResponse = await IpfsGeoIpLookup(DEFAULT_IPFS_GATEWAY, ip);
          if (geoipResponse?.country_code != null) {
            geoipResponse.time = Date.now();
            const responseSTR = JSON.stringify(geoipResponse);
            localStorage.setItem(hostname, responseSTR);
            return this.onResponse(geoipResponse);
          } else {
            console.log("geoipResponse.country_code is null");
          }
        } catch (e) {
          // console.log(`error while getting DNS A record for ${hostname}`, e);
        }
      } else {
        console.log("IP is still null", response);
      }
    },
    onResponse(response) {
      return `https://ipfs.io/ipfs/QmaYjj5BHGAWfopTdE8ESzypbuthsZqTeqz9rEuh3EJZi6/${response.country_code.toLowerCase()}.svg`;
    },
    getLocation(url) {
      if (url) {
        let aDom = document.createElement("a");
        aDom.href = url;
        let j = {
          hostname: aDom.hostname,
          host: aDom.host,
          origin: aDom.origin,
          protocol: aDom.protocol,
          pathname: aDom.pathname,
          hash: aDom.hash,
        };
        let Domain = j.hostname.match(
          /([a-z0-9][a-z0-9\-]*?\.(?:com\.cn|net\.cn|org\.cn|com\.au|imipo\.shop|com|cn|co|net|org|gov|cc|biz|info|hn|xyz|hk|icu|us|mobi|art|wang|me|so|top|win|vip|ltd|red|ru|ac\.cn|xn--kput3i|xin|xn--3ds443g|shop|site|club|fun|online|link|gov\.cn|name|pro|work|tv|kim|group|tech|store|cx|ren|ink|pub|live|wiki|design|xn--fiq228c5hs|xn--6qq986b3xl|xn--fiqs8s|xn--ses554g|xn--hxt814e|xn--55qx5d|xn--io0a7i|xn--3bst00m)(?:\.(?:cn|jp))?)$/
        );
        if (Domain) {
          j.domain = Domain[0];
        }
        return j;
      }
    },
    testHttp(link) {
      let httpRegex = /(http|https):\/\/([\w.]+\/?)\S*/;
      const httpMatch = httpRegex.exec(link);
      return httpMatch;
    },
    toIpfs(url) {
      window.open(url);
    },
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    sortArr(arr) {
      return arr.sort(this.compare("time"));
    },
  },
};
</script>
<style lang="less">
.header {
  width: 100%;
  border-bottom: 1px solid rgba(140, 140, 161, 0.25);
  .header-container {
    width: 100%;
    max-width: 1440px;
    height: 96px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding: 0 54px;
  }
  .name {
    max-width: 300px;
    color: #000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: Helvetica;
    font-size: 32px;
    font-style: normal;
    font-weight: 700;
    line-height: 36px;
  }
  .int-box {
    display: flex;
    width: 100%;
    max-width: 640px;
    height: 48px;
    padding: 12px;
    align-items: center;
    gap: 12px;
    border-radius: 64px;
    border: 1px solid rgba(140, 140, 161, 0.25);
    background: #fff;
    box-sizing: border-box;
    margin: 0 auto;
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
      color: #000;
      font-size: 16px;
      font-weight: 400;
    }
  }
}
.body {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
  .left-ad {
  }
  .main {
    width: 100%;
    max-width: 960px;
    // margin: 0 auto;
    margin: 0 20px;
    .top-ad {
      margin-bottom: 16px;
    }
    .table {
      .table-head {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding: 16px 0px;
        border-radius: 16px;
        background: rgba(30, 80, 255, 0.05);
        div {
          width: 120px;
          padding: 3px 25px 3px 23px;
          text-align: center;
          box-sizing: border-box;
          color: #8c8ca1;
          font-family: Helvetica;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
        .Link {
          flex: 1;
          width: 100%;
          text-align: left;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .table-body {
        .table-line {
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          padding: 16px 0px;
          border-bottom: 1px solid rgba(140, 140, 161, 0.25);
          div {
            width: 120px;
            padding: 3px 25px 3px 23px;
            text-align: center;
            box-sizing: border-box;
            color: #8c8ca1;
            font-family: Helvetica;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
          }
          .Link {
            flex: 1;
            width: 100%;
            text-align: left;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .Download {
            img {
              cursor: pointer;
            }
          }
        }
      }
    }
    .bottom-ad {
      margin-top: 50px;
    }
  }
  .right-ad {
  }
}
</style>
