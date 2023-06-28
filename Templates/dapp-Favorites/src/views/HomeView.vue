<template>
  <div class="home" v-if="config">
    <div class="head">
      <div class="info">
        <div class="container">
          <div class="avatar">
            <img
              :src="
                config.avatar ? config.avatar : require('@/assets/dapps.png')
              "
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="container">
        <div style="width: 100%;" >
          <div class="cardLine">
            <div class="card" v-for="(item, index) in mediaList">
              <div class="face">
                <!-- 卡片 logo -->
                <img class="logo" :src="item.logo" />
                <!-- 卡片号码 -->
                <label>Project Name</label>
                <input class="card-number" :placeholder="item.name" type="text" required maxlength="16" />
                <!--  -->
                <div class="container2">
                  <!-- Project Label -->
                  <div class="name">
                    <label>Project Label</label>
                    <input class="card-name" :placeholder="item.lable" type="text" required />
                  </div>
                </div>
              </div>

              <div class="back">
                <div @click="goMedia(item.link)">
                  <div style="display: flex;align-items: center;justify-content: center;width: 100%;font-size: 20px;font-weight: 600;">Project Name：{{item.name}}</div>
                  <br>
                  <div style="display: flex; align-items: center;justify-content: center;width: 100%;font-size: 16px;font-weight: normal;">{{item.description}}</div>
                </div>
              </div>
            </div>
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
      searchKey: null,
      config: null,
      currentDate: new Date()
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
          debugger
          let Arr = [];
          const { data } = res;
          this.config = data;
          console.log(res)
          data.config.forEach((item, index) => {
              if (item.name === 'Avatar') {
                  this.config.avatar = item.options[0].value
              }
              if (item.name === 'DappFavorites') {
                  item.options[0].items.forEach((i) => {
                      if (i.name) {
                          Arr.push(i)
                      }
                  })
              }
          })
          this.mediaList = Arr;
          console.log(this.mediaList)
          this.showList = []
          if (this.mediaList.length > 0) {
              for (var i = 0; i < this.mediaList.length; i++) {
                  if (i % 4 === 0) {
                      const array = []
                      array.push(this.mediaList[i])
                      this.showList.push(array)
                  } else {
                      this.showList[Math.floor(i / 4)].push(this.mediaList[i])
                  }
              }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    get:function (event) {
        if(event.keyCode==38||event.keyCode==40)return;
        if(event.keyCode==13){
            window.open('https://www.baidu.com/s?wd='+this.keyword);
            this.keyword=''
        }
        this.$http.jsonp('https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?', {
            params: {
                wd: this.keyword
            },
            jsonp: 'cb'
        }).then((res) => {
            console.log("res11",res)
        })
    },
    goMedia(link) {
      window.open(link);
    },
  },
};
</script>
<style lang="less">
.container {
  max-width: 100%;
  margin: auto;
}
.home {
  min-height: 90vh;
  .head {
    .info {
      .avatar {
        text-align: center;
        img {
          width: 305px;
          height: 150px;
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
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }


  .cardLine {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-left: 100px;
    padding-right: 100px;
  }
  .card {
    display: flex;
    flex-direction: column;
    height: 260px;
    width: 320px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(35px);
    border: 2px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 80px rgba(0, 0, 0, 0.25);
    margin: 20px;
    padding: 20px;
  }
  .face {
    position: absolute;
    backface-visibility: hidden;
    transition: 0.5s;
  }
  .back {
    position: absolute;
    backface-visibility: hidden;
    transition: 0.5s;
    transform: rotateY(180deg);
    padding: 20px;
  }

  .card:hover{
    overflow: auto;
  }
  /*.card:not(:hover) {*/
    /*overflow: hidden;*/
  /*}*/

  .card:hover .face{
    transform: rotateY(-180deg)
  }
  .card:hover .back{
    transform: rotateY(0deg)
  }



  .container2 {
    display: flex;
  }
  .logo {
    height: 60px;
    width: 80px;
    margin-bottom: 20px;
  }
  .card-number {
    font-size: 30px;
    font-family: "Space Mono", monospace;
    width: 100%;
    height: 50px;
    margin-bottom: 40px;
  }
  .card-number::placeholder {
    color: black;
    font-size: 22px;
    font-family: "Space Mono", monospace;
  }
  input::placeholder {
     color: black;
     font-family: "Space Mono", monospace;
   }
  input{
    color: black;
    font-family: "Space Mono", monospace;
  }
  .name {
    font-family: "Space Mono", monospace;
    padding: 0px 80px 0px 0px;
    margin-right: 40px;
    width: 150px;
    position: relative;
    display: inline-block;
    overflow: hidden;
  }
  input {
    font-family: "Space Mono", monospace;
    border: none;
    font-size: 16px;
    height: 26px;
    color: black;
    background: 0;
    padding: 0;
    width: 0;
    border-bottom: 1px solid white;
  }
  label {
    color: black;
    font-weight: 600;
    font-size: 16px;
    font-family: "Space Mono", monospace;
    pointer-events: none;
    display: block;
    padding-bottom: 2px;
  }
  .card-name {
    color: white;
    font-size: 16px;
    height: 26px;
    width: 160px;
    border-bottom: 1px solid white;
    color: white;
  }
/*  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }*/
}
</style>
