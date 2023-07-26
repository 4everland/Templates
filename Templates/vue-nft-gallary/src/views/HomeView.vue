<script setup>
import NftList from '../components/nft-list.vue'
</script>

<template>
  <main>
    <header>
      <div class="al-c">
        <img :src="info.logo" height="45" />
        <h1 class="ml-2 fz-18">{{ info.title }}</h1>
      </div>
    </header>
    <div class="pa-5"></div>
    <div class="ta-c m-9">
      <h2 class="fz-30 d-ib" style="max-width: 700px">
        {{ info.bio }}
      </h2>
    </div>
    <nft-list :info="info" v-if="info.walletAddr"></nft-list>
    <div class="mt-8 ta-c gray" v-if="errMsg">{{ errMsg }}</div>

    <div class="op-0">
      <img :src="'img/def.png'" width="20" />
    </div>
  </main>
</template>

<script>
import Axios from 'axios'

export default {
  data() {
    return {
      errMsg: '',
      info: {
        title: 'My NFT Gallery',
        spanApiKey: 'Kjm3vweLwcJwr228lejHwbjCyaaEvfzz',
        bio: 'HI! Welcome to My NFT Gallery.',
        logo: 'img/logo.png',
        walletAddr: '' // 0x145BD3C05D8d3117d133f577fa9af538ba353e8C
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    async getConfig() {
      try {
        const {
          data: { config }
        } = await Axios.get('./config.json')
        const info = {}
        for (const row of config) {
          const arr = row.options
          for (const row of arr) {
            info[row.key] = row.value || this.info[row.key]
          }
        }
        console.log(info)
        this.info = info
        document.title = info.title
        if (!info.walletAddr) {
          throw new Error('Wallet Address required')
        }
      } catch (error) {
        console.log(error)
        this.errMsg = 'Confit Error: ' + error.message
      }
    }
  }
}
</script>

<style>
main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px;
}
</style>
