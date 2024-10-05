<template>
  <div class="page flex-col">
    <div class="section_1 flex-row justify-between">
      <img class="label_1" referrerpolicy="no-referrer"
        src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGd1824a8f6f10d8ca55d129f60ff453cc.png" @click="back" />
      <span class="text_1">Asset&nbsp;List</span>
    </div>
    <div class="list_1 flex-col" @scroll="handleScroll" ref="scrollContainer">
      <div class="list-items_1 flex-row" v-for="(item, index) in assets" :key="index">
        <div class="image-wrapper_1 flex-col">
          <!-- <img
              class="thumbnail_1"
              referrerpolicy="no-referrer"
              :src="item.lanhuimage0"
            /> -->
        </div>
        <span class="text_2" v-html="item.lanhutext0"></span>
        <div class="text-wrapper_1 flex-col justify-between">
          <span class="text_3" v-html="item.lanhutext1"></span>
          <!-- <span class="text_4" v-html="item.lanhutext2"></span> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { showToast } from 'vant';
import { user_assets } from '../../lib/loadApp'
//   import { useRoute,useRouter } from 'vue-router'

export default {
  data() {
    return {
      assets: [],
      page: 1,
      size: 10,
      total: 0,
      loopData0: [
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG02c2323d66787ef4484e171020a3ea38.png',
          lanhutext0: 'eto',
          lanhutext1: '1,924,121,1243.310',
          lanhutext2: '＄1,151',
        },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG02c2323d66787ef4484e171020a3ea38.png',
          lanhutext0: 'eto',
          lanhutext1: '1,924,121,124,310',
          lanhutext2: '＄1,151',
        },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG02c2323d66787ef4484e171020a3ea38.png',
          lanhutext0: 'eto',
          lanhutext1: '1,924,121,124,310',
          lanhutext2: '＄1,151',
        },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG02c2323d66787ef4484e171020a3ea38.png',
          lanhutext0: 'eto',
          lanhutext1: '1,924,121,124,310',
          lanhutext2: '＄1,151',
        },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG02c2323d66787ef4484e171020a3ea38.png',
          lanhutext0: 'eto',
          lanhutext1: '1,924,121,124,310',
          lanhutext2: '＄1,151',
        },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG02c2323d66787ef4484e171020a3ea38.png',
          lanhutext0: 'eto',
          lanhutext1: '1,924,121,124,310',
          lanhutext2: '＄1,151',
        },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG02c2323d66787ef4484e171020a3ea38.png',
          lanhutext0: 'eto',
          lanhutext1: '1,924,121,124,310',
          lanhutext2: '＄1,151',
        },
        {
          lanhuimage0:
            'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG02c2323d66787ef4484e171020a3ea38.png',
          lanhutext0: 'eto',
          lanhutext1: '1,924,121,124,310',
          lanhutext2: '＄1,151',
        },
      ],
      constants: {},
    };
  },
  methods: {
    back() {
      // const router = useRouter()
      // router.back()
      this.$router.back()
    },
    getData(page, size) {
      let _ = this
      user_assets(page, size).then(res => {
        _.total = res.total
        let temp = res.data
        for (let i = 0; i < temp.length; i++) {
          let asset = temp[i]
          asset.lanhutext0 = asset.symbol
          asset.lanhutext1 = asset.balance / asset.unit
          asset.lanhutext2 = '$-.--'
        }
        if (temp && temp.length) {
          _.assets = _.assets.concat(temp)
          _.page = page
        }
        console.log('_.assets =', _.assets)
      }).catch(error => {
        showToast(error.message)
      })
    },
    handleScroll() {
      let scrollContainer = this.$refs['scrollContainer']
      console.log('handleScroll = ', scrollContainer)
      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        if (Math.ceil(scrollHeight) - Math.ceil(scrollTop) === clientHeight) {
          // if(pageCount.value >= resData.inviteeCount) return;
          let page = this.page + 1
          this.getData(page, this.size)
        }
      }
    }
  },
  mounted() {
    this.getData(this.page, this.size)
  },
};
</script>

<style scoped>
.page {
  background-color: rgba(20, 20, 20, 1);
  position: relative;
  width: 100vw;
  height: 215.74vw;
  overflow: hidden;

  .section_1 {
    width: 80vw;
    height: 7.47vw;
    margin: 2.13vw 0 0 4.8vw;

    .label_1 {
      width: 7.47vw;
      height: 7.47vw;
    }

    .text_1 {
      width: 69.34vw;
      height: 7.47vw;
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 5.33vw;
      font-family: Roboto Flex-Bold;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
      line-height: 7.47vw;
    }
  }

  .list_1 {
    width: 90.67vw;
    height: 190.47vw;
    overflow: scroll;
    /* justify-content: space-between; */
    margin: 8.53vw 0 34.66vw 4.8vw;

    .list-items_1 {
      width: 90.67vw;
      height: 16vw;
      border: 1px solid rgba(41, 41, 41, 1);
      margin-bottom: 2.14vw;
      justify-content: flex-center;

      .image-wrapper_1 {
        background-color: rgba(255, 255, 255, 0);
        border-radius: 55px;
        height: 4.27vw;
        width: 4.27vw;
        margin: 5.86vw 0 0 2.13vw;

        .thumbnail_1 {
          width: 3.74vw;
          height: 3.2vw;
          margin: 0.8vw 0 0 0.53vw;
        }
      }

      .text_2 {
        width: 20.27vw;
        height: 6.4vw;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 4.26vw;
        font-family: Roboto Flex-Bold;
        font-weight: 700;
        text-align: left;
        white-space: nowrap;
        line-height: 6.4vw;
        margin: 4.8vw 0 0 1.06vw;
      }

      .text-wrapper_1 {
        width: 38.4vw;
        height: 11.74vw;
        margin: 2.13vw 2.13vw 0 22.4vw;

        .text_3 {
          width: 38.4vw;
          height: 6.4vw;
          overflow-wrap: break-word;
          color: rgba(255, 255, 255, 1);
          font-size: 4.26vw;
          font-family: Roboto Flex-Regular;
          font-weight: normal;
          text-align: right;
          white-space: nowrap;
          line-height: 6.4vw;
          margin-top: 2.4vw;
        }

        .text_4 {
          width: 11.47vw;
          height: 5.34vw;
          overflow-wrap: break-word;
          color: rgba(191, 191, 191, 1);
          font-size: 3.2vw;
          font-family: Roboto Flex-Regular;
          font-weight: normal;
          text-align: right;
          white-space: nowrap;
          line-height: 5.34vw;
          margin-left: 26.94vw;
        }
      }
    }
  }
}

@media screen and (min-width: 1024px) {
  .page {
    background-color: rgba(20, 20, 20, 1);
    position: relative;
    width: 375px;
    height: 810.78px;

    .section_1 {
      width: 300px;
      height: 28px;
      margin: 8px 0 0 18px;

      .label_1 {
        width: 28px;
        height: 28px;
      }

      .text_1 {
        width: 260px;
        height: 28px;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 20px;
        font-family: 'Roboto Flex-Bold';
        font-weight: 700;
        text-align: center;
        white-space: nowrap;
        line-height: 28px;
      }
    }

    .list_1 {
      width: 340px;
      height: 715.78px;
      overflow: scroll;
      margin: 32px 0 130px 18px;

      .list-items_1 {
        width: 340px;
        height: 60px;
        border: 1px solid rgba(41, 41, 41, 1);
        margin-bottom: 8px;
        justify-content: center;

        .image-wrapper_1 {
          background-color: rgba(255, 255, 255, 0);
          border-radius: 55px;
          height: 16px;
          width: 16px;
          margin: 22px 0 0 8px;

          .thumbnail_1 {
            width: 14px;
            height: 12px;
            margin: 2px 0 0 2px;
          }
        }

        .text_2 {
          width: 76px;
          height: 24px;
          overflow-wrap: break-word;
          color: rgba(255, 255, 255, 1);
          font-size: 16px;
          font-family: 'Roboto Flex-Bold';
          font-weight: 700;
          text-align: left;
          white-space: nowrap;
          line-height: 24px;
          margin: 18px 0 0 4px;
        }

        .text-wrapper_1 {
          width: 144px;
          height: 44px;
          margin: 8px 8px 0 84px;

          .text_3 {
            width: 144px;
            height: 24px;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 16px;
            font-family: 'Roboto Flex-Regular';
            font-weight: normal;
            text-align: right;
            white-space: nowrap;
            line-height: 24px;
            margin-top: 9px;
          }

          .text_4 {
            width: 43px;
            height: 14px;
            overflow-wrap: break-word;
            color: rgba(191, 191, 191, 1);
            font-size: 12px;
            font-family: 'Roboto Flex-Regular';
            font-weight: normal;
            text-align: right;
            white-space: nowrap;
            line-height: 14px;
            margin-left: 101px;
          }
        }
      }
    }
  }

}
</style>