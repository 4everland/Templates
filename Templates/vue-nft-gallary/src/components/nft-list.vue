<style lang="scss">
.bg-black1 {
  background: linear-gradient(180deg, #0000, #0004);
  p {
    transition: all linear 200ms;
    opacity: 0;
    transform: translateY(-20px);
  }
}
.nft-item {
  display: block;
  transition: all linear 200ms;
  &:hover {
    box-shadow: 0 0 6px #aaa;
    .bg-black1 p {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
li.no-dot {
  list-style: none;
}
ul.tag-ul {
  li {
    cursor: pointer;
  }
  li::after {
    position: absolute;
    content: '';
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    height: 5px;
    width: 0;
    background: #5fcb95;
    z-index: -1;
    transition: all ease 180ms;
  }
  li:hover,
  li.active {
    color: #333;
    &::after {
      width: 110%;
    }
  }
}
</style>

<template>
  <div>
    <div class="pa-3"></div>
    <ul class="al-c f-center f-wrap tag-ul mb-8">
      <li
        @click="tagIdx = i"
        class="pos-r fz-18 gray"
        :class="[
          i == 0 ? 'no-dot' : 'ml-7',
          {
            active: tagIdx == i
          }
        ]"
        v-for="(it, i) in tags"
        :key="i"
      >
        <span>{{ it.name }}</span>
      </li>
    </ul>
    <div class="pa-4"></div>
    <div v-if="!list || !list.length" class="pa-5 ta-c fz-14">
      <span v-if="!list">Loading...</span>
      <span v-else>No NFT</span>
    </div>
    <div v-else>
      <el-row :gutter="12">
        <el-col
          @click="onItem(it)"
          class="mb-3"
          :span="12"
          :md="6"
          v-for="it in list"
          :key="it.img"
        >
          <a
            :href="`https://opensea.io/assets/${curTag.chain}/${it.contract_address}/${it.id}`"
            target="_blank"
            class="pos-r nft-item"
          >
            <img :src="it?.nft?.image_url || 'img/def.png'" class="w100p d-b" />
            <div class="pos-mask white h-flex">
              <div class="pa-3 fz-14 mt-auto bg-black1">
                <p class="op-9 line-1">
                  <span class="fz-18 mr-1">{{ it.nft?.name?.replace(` #${it.id}`, '') }}</span>
                  <span>{{ `#${it.id}` }}</span>
                </p>
                <!-- <p class="mt-2 fz-15 line-3 d-n">{{ it.nft?.description }}</p> -->
              </div>
            </div>
          </a>
        </el-col>
      </el-row>
      <div class="mt-5 ta-c">
        <button v-if="!finished" @click="onLoad">
          {{ loadingMore ? 'Loading...' : 'Load More' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'

export default {
  props: {
    info: Object
  },
  data() {
    return {
      tagIdx: 0,
      tags: [
        {
          name: 'Ethereum',
          net: 'eth-main',
          chain: 'ethereum'
        },
        {
          name: 'Polygon',
          net: 'poly-main',
          chain: 'matic'
        },
        {
          name: 'Arbitrum',
          net: 'arbitrum-main',
          chain: 'arbitrum'
        },
        {
          name: 'Optimism',
          net: 'optimism-main',
          chain: 'optimism'
        },
        {
          name: 'BSC',
          net: 'bsc-main',
          chain: 'bsc'
        }
      ],
      errMsg: '',
      pageSize: 12,
      list: null,
      loadingMore: false,
      finished: false
    }
  },
  computed: {
    curTag() {
      return this.tags[this.tagIdx]
    }
  },
  watch: {
    tagIdx() {
      this.list = null
      this.getList()
    },
    loadingMore(val) {
      if (val) this.getList()
    }
  },
  created() {
    this.getList()
    window.onscroll = () => {
      this.onScroll()
    }
    window.onresize = () => {
      this.onScroll()
    }
  },
  methods: {
    onScroll() {
      const maxY = document.documentElement.scrollHeight - document.documentElement.clientHeight
      this.loadingMore = maxY - window.scrollY <= 10
    },
    onLoad() {
      if (this.loadingMore) return
      this.loadingMore = true
      this.getList()
    },
    onItem(it) {
      console.log(it)
      if (!it.nft) {
        this.getDetail(it)
      }
    },
    async getDetail(it) {
      if (!this.list?.find((row) => row.id == it.id)) {
        return
      }
      if (it.loading) return
      it.loading = true
      let obj = {}
      try {
        // const { data } = await Axios.get(
        //   `https://api.blockspan.com/v1/nfts/contract/${it.contract_address}/token/${it.id}`,
        //   {
        //     params: {
        //       chain: this.curTag.net
        //     },
        //     headers: {
        //       'x-api-key': this.info.spanApiKey
        //     }
        //   }
        // )
        // const imgs = data.cached_images || {}
        // let image_url = imgs.medium_500_500 || imgs.original || ''
        // let name = data.token_name
        const {
          data: { nft }
        } = await Axios.get(
          `https://api.opensea.io/v2/chain/${this.curTag.chain}/contract/${it.contract_address}/nfts/${it.id}`,
          {
            headers: {
              'x-api-key': 'd00c0996737e43669e8dd0ff6e712b57'
            }
          }
        )
        obj = {
          nft
        }
      } catch (error) {
        console.log(error)
        obj = {
          errMsg: error.message
        }
      }
      obj.loading = false
      Object.assign(it, obj)
    },
    async getList() {
      if (this.loadingMore && this.finished) {
        return
      }
      try {
        this.errMsg = ''
        const params = {
          chain: this.curTag.net,
          token_type: 'erc721',
          page_size: this.pageSize
        }
        if (this.list?.length) {
          params.cursor = this.nextCursor
        }
        const { data } = await Axios.get(
          `https://api.blockspan.com/v1/nfts/owner/${this.info.walletAddr}`,
          {
            params,
            headers: {
              'x-api-key': this.info.spanApiKey
            }
          }
        )
        const rows = data.results
        if (!this.list) {
          this.list = rows
        } else {
          this.list = [...this.list, ...rows]
        }
        this.nextCursor = data.cursor
        this.finished = rows.length < this.pageSize
        console.log(data, this.finished)
        this.loadDetail()
      } catch (error) {
        console.log(error)
        this.errMsg = error.message
        if (!this.list) this.list = []
      }
      this.loadingMore = false
    },
    async loadDetail() {
      for (const it of this.list) {
        if (!it.nft) await this.getDetail(it)
      }
    }
  }
}
</script>