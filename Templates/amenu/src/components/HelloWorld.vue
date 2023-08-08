<template>
  <div class="home" v-if="config">
    <div class="head">
      <div 
      class="banner"
      ></div>

    <div class="info">
    <div class="container">
     <div class="avatar">
        <img :src="config.avatar ? config.avatar : require('@/assets/avatar.jpg')"/> </div>
    <div class="title">
     {{config.menuName}}
    </div>

    <div class="desc">
     {{ config.bio }}
    </div>
   </div>
    </div>


    <div class="oo">

    <div class="body">



    <div class="supply">
      In Supply 
    </div>





      <div class="supplyMenu" v-for='(item,index) in supply'>

        <div class='type'>{{item.type}}</div>


        <div class="box">
        <div class='card' v-for='(items,indexs) in item.List'>
           <img class="photo" :src="items.img" :onerror="defaultimg"/>
           <div class="name">{{items.name}}</div>
            <div class="bio">{{items.bio}}</div>

        </div>
        </div>


       </div>
  </div>
</div>
</div>
<template>
  <div class="notyet"  v-if="unsupply">


<div class="oo">
  <div class="body">
    <div class="supply">
      Not Yet
    </div>


    <div class="supplyMenu">

        <div class="box">
        <div class='card' v-for='(items,indexs) in unsupply'>
           <img class="photo2" :src="items.img" :onerror="defaultimg"/>
           <div class="name">{{items.name}}</div>
            <div class="bio">{{items.bio}}</div>


        </div>
        </div>

    </div>
</div>

</div>

    </div>

</template>

    <div  class="foot">

    </div>



    </div>

    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      config: null,
      supply:null,
      unsupply:null,
    };
  },
  computed:{
    defaultimg(){
      return 'this.src="' + require('@/assets/place.jpg')+'"';
    }
  },
  mounted(){
    this.$axios.get('./config.json').then(res=>{
      console.log(res.data);
      let configObj = {};
      let Menu = [];
      const{ data } = res;

      data.config.forEach((item,index) =>{
        let navObj = {};
      
          item.options.forEach((i)=>{
            if (i.key != 'menu'){
            configObj[i.key] = i.value;
          }else{
            configObj[i.key] = i.items;
          }
          })

      });
      this.config = configObj
      Menu = configObj.menu



      let menuArr =[];
      let yArr =[];
      let nArr = [];


      Menu.map(mapItem=>{
        if(mapItem.supply=='y'){
          yArr.push(mapItem);
        }else{
          nArr.push(mapItem);
        }
      })



      yArr.map(mapItem=>{
        if(menuArr.length == 0 ){
          menuArr.push({type:mapItem.type,List:[mapItem]})
        }else{
          let ress = menuArr.some(item=>{
            if(item.type == mapItem.type){
              item.List.push(mapItem)
              return true
            }
          })
          if(!ress){
            menuArr.push({type:mapItem.type,List:[mapItem]})
          }
        }
      });

      this.supply= menuArr;
      if(nArr.length!=0){
      this.unsupply= nArr;}

      if(configObj.menuName){
        document.title = configObj.menuName;
      }



      console.log(menuArr);





    })
  }
}
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">



.oo{
  padding-left:42px;
}
.foot{
  height:40px;
}


.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
}

.notyet{
background-color: #f1dcbb;
margin-top:50px;
padding-bottom:60px;

}

.home {
  background-color: #fef5e3;
  min-height: 86vh;
  .head {
    .banner {
      background-image: url("@/assets/headbg.png");
      width: 100%;
      height: 400px;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .info {
      position: relative;
      background-color: #fff;
      box-sizing: border-box;
      .avatar {
        width: 136px;
        height: 136px;
        border: 4px solid #ffffff;
        border-radius: 50%;
        position: absolute;
        top: -284px;
        left: 0;
        right: 0;
        margin: 0 auto;
        text-align: center;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: block;
        }
      }
      .title {
        width: 193px;
        height: 42px;
        font-size: 30px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: center;
        color: #252525;
        line-height: 42px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        top: -132px;
        left: 0;
        right: 0;
        margin: 0 auto;
        position: absolute;
      }
      .desc{
        width: 400px;
        height: 50px;
        font-size: 18px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: center;
        color: #252525;
        line-height: 25px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap:break-word;
        top: -80px;
        left: 0;
        right: 0;
        margin: 0 auto;
        position: absolute;
      }
    }
  }
  .body{
      max-width:1200px;
      margin: 0 auto;

    .supplyMenu{
      max-width:1200px;
    }

    .supply{
      width: 120px;
      height: 33px;
      font-size: 24px;
      font-family: PingFang SC, PingFang SC-Semibold;
      font-weight: 600;
      text-align: center;
      color: #795c22;
      line-height: 33px;
      padding-top:40px;
      left: 0;
      right: 0;
      margin: 0 auto;
    }
    .supplyMenu{

    }

    .box{
      max-width:1242px;
      display:flex;
      flex-direction:row;
      justify-content:flex-start;
      margin-left:-42px;

      flex-wrap: wrap;


    }

    .type{
        height: 28px;
        font-size: 20px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #252525;
        line-height: 28px;
        margin-top:40px;
        margin-bottom:-30px;
      }

    .card{
      width:372px;
      display:flex;
      flex-direction:column;
      justify-content:flex-start;
      margin-left:42px;
      margin-top:50px;
    }

    .photo{
      width:372px;
      height:228px;
      border-radius:8px;

         }
    .photo2{
      width:372px;
      height:228px;
      border-radius:8px;
      opacity:0.7;

         }
    .name{
        width: 208px;
        height: 22px;
        font-size: 16px;
        font-family: PingFang SC, PingFang SC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #252525;
        line-height: 22px;
        margin-top:16px;
    }
    .bio{
        width: 372px;
        height: 20px;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC-Regular;
        font-weight: 400;
        text-align: left;
        color: #252525;
        line-height: 20px;
        margin-top:8px;

    }
  }
}

</style>
