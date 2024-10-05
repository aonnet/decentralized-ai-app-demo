<template>
    <div class="page flex-col">
      <div class="section_1 flex-row justify-between">
        <img
          class="label_1"
          referrerpolicy="no-referrer"
          src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGd1824a8f6f10d8ca55d129f60ff453cc.png"
          @click="back"
        />
        <span class="text_1">Bill</span>
      </div>
      <!-- <div class="section_2 flex-row justify-between">
        <div class="image-text_1 flex-row justify-between">
          <span class="text-group_1">property</span>
          <img
            class="thumbnail_1"
            referrerpolicy="no-referrer"
            src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG83e91294bd2a0972ef78190664d0310a.png"
          />
        </div>
        <div class="image-text_2 flex-row justify-between">
          <span class="text-group_2">type</span>
          <img
            class="thumbnail_2"
            referrerpolicy="no-referrer"
            src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG83e91294bd2a0972ef78190664d0310a.png"
          />
        </div>
        <div class="image-text_3 flex-row justify-between">
          <span class="text-group_3">time</span>
          <img
            class="thumbnail_3"
            referrerpolicy="no-referrer"
            src="https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG83e91294bd2a0972ef78190664d0310a.png"
          />
        </div>
      </div> -->
      <div class="list_1 flex-col" @scroll="handleScroll" ref="scrollContainer">
        <div
          class="list-items_1 flex-row justify-between"
          v-for="(item, index) in items"
          :key="index"
        >
          <div class="box_1 flex-col justify-between">
            <div class="group_1 flex-row justify-between">
              <img
                class="thumbnail_4"
                referrerpolicy="no-referrer"
                :src="item.lanhuimage0"
              />
              <span class="text_2" v-html="item.lanhutext0"></span>
            </div>
            <span class="text_3" v-html="item.lanhutext1"></span>
          </div>
          <div class="text-group_4 flex-col justify-between">
            <span
              class="text_4"
              :style="{ color: item.lanhufontColor2 }"
              v-html="item.lanhutext2"
            ></span>
            <span class="text_5" v-html="item.lanhutext3"></span>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  import { showToast } from 'vant';
  import {ledger} from '../../lib/loadApp'
  import moment from 'moment'
import { pa } from 'element-plus/es/locales.mjs';
  export default {
    data() {
      return {
        items:[],
        page:1,
        size:10,
        total:0,
        loopData0: [
          {
            lanhuimage0:
              'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG4f5edd08d8b070a9039cc02b73924893.png',
            lanhutext0: 'ustd&nbsp;to&nbsp;ACCOUNT',
            lanhutext1: '2024/02/28&nbsp;15:32',
            lanhutext2: '+1,156.000',
            lanhufontColor2: 'rgba(255,236,61,1.000000)',
            lanhutext3: 'balance＄1,151',
          },
          {
            lanhuimage0:
              'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGb9fce4e34e14e5e7057323fef9693470.png',
            lanhutext0: 'ustd&nbsp;to&nbsp;ACCOUNT',
            lanhutext1: '2024/02/28&nbsp;15:32',
            lanhutext2: '-180.000',
            lanhufontColor2: 'rgba(67,232,160,1.000000)',
            lanhutext3: 'balance＄1,151',
          },
          {
            lanhuimage0:
              'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG4f5edd08d8b070a9039cc02b73924893.png',
            lanhutext0: 'ustd&nbsp;to&nbsp;ACCOUNT',
            lanhutext1: '2024/02/28&nbsp;15:32',
            lanhutext2: '+1,156.000',
            lanhufontColor2: 'rgba(255,236,61,1.000000)',
            lanhutext3: 'balance＄1,151',
          },
          {
            lanhuimage0:
              'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGb9fce4e34e14e5e7057323fef9693470.png',
            lanhutext0: 'ustd&nbsp;to&nbsp;ACCOUNT',
            lanhutext1: '2024/02/28&nbsp;15:32',
            lanhutext2: '-180.000',
            lanhufontColor2: 'rgba(67,232,160,1.000000)',
            lanhutext3: 'balance＄1,151',
          },
          {
            lanhuimage0:
              'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG4f5edd08d8b070a9039cc02b73924893.png',
            lanhutext0: 'ustd&nbsp;to&nbsp;ACCOUNT',
            lanhutext1: '2024/02/28&nbsp;15:32',
            lanhutext2: '+1,156.000',
            lanhufontColor2: 'rgba(255,236,61,1.000000)',
            lanhutext3: 'balance＄1,151',
          },
          {
            lanhuimage0:
              'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGb9fce4e34e14e5e7057323fef9693470.png',
            lanhutext0: 'ustd&nbsp;to&nbsp;ACCOUNT',
            lanhutext1: '2024/02/28&nbsp;15:32',
            lanhutext2: '-180.000',
            lanhufontColor2: 'rgba(67,232,160,1.000000)',
            lanhutext3: 'balance＄1,151',
          },
          {
            lanhuimage0:
              'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG4f5edd08d8b070a9039cc02b73924893.png',
            lanhutext0: 'ustd&nbsp;to&nbsp;ACCOUNT',
            lanhutext1: '2024/02/28&nbsp;15:32',
            lanhutext2: '+1,156.000',
            lanhufontColor2: 'rgba(255,236,61,1.000000)',
            lanhutext3: 'balance＄1,151',
          },
          {
            lanhuimage0:
              'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGb9fce4e34e14e5e7057323fef9693470.png',
            lanhutext0: 'ustd&nbsp;to&nbsp;ACCOUNT',
            lanhutext1: '2024/02/28&nbsp;15:32',
            lanhutext2: '-180.000',
            lanhufontColor2: 'rgba(67,232,160,1.000000)',
            lanhutext3: 'balance＄1,151',
          },
        ],
        constants: {},
      };
    },
    methods: {
        back() {
            this.$router.back()
        },
        getData(page,size) {
          let _ = this
          ledger(page,size).then(res => {
              _.total = res.total
              let temp = res.data
              for(let i = 0; i < temp.length; i++) {
                    let item = temp[i]
                    let symbol = item.asset && item.asset && item.asset.symbol
                    item.lanhutext2 = '-' + (item.amount / item.unit)
                    item.lanhutext1 = moment(item.created_at).format('YYYY-MM-DD HH:mm');
                    item.lanhutext0 = symbol + ' from ACCOUNT'
                    item.lanhuimage0 = 'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNGb9fce4e34e14e5e7057323fef9693470.png'
                    if (item.type == 1 || (item.type == 4 && item.from_user_id == '00000000-0000-0000-0000-000000000000')) {
                        item.lanhutext2 = '+' + (item.amount / item.unit)
                        item.lanhutext0 = symbol + ' to ACCOUNT'
                        item.lanhuimage0 = 'https://lanhu-oss.lanhuapp.com/MasterDDSSlicePNG4f5edd08d8b070a9039cc02b73924893.png'
                    }
                // item.lanhutext3 = 'balance ＄0.00'
              }
              if (temp && temp.length){
                _.items = _.items.concat(temp)
                // _.page += 1
                _.page = page
              }
              console.log('ledger temp item = ',_.items,temp)
            }).catch(error => {
                showToast(error.message)
            })
        },
        handleScroll() {
          let scrollContainer = this.$refs['scrollContainer']
          // console.log('handleScroll = ',scrollContainer)
            if (scrollContainer) {
                const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
                if (Math.ceil(scrollHeight) - Math.ceil(scrollTop) === clientHeight) {
                    // if(pageCount.value >= resData.inviteeCount) return;
                    let page = this.page + 1
                    this.getData(page,this.size)
                }
            }
        }
    },
    mounted() {
      let page = this.page
      this.getData(page,this.size)
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
  .section_2 {
    width: 62.4vw;
    height: 6.4vw;
    margin: 9.6vw 0 0 6.93vw;
    .image-text_1 {
      width: 21.34vw;
      height: 6.4vw;
      .text-group_1 {
        width: 17.07vw;
        height: 6.4vw;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 4.26vw;
        font-family: Roboto Flex-Bold;
        font-weight: 700;
        text-align: center;
        white-space: nowrap;
        line-height: 6.4vw;
      }
      .thumbnail_1 {
        width: 3.2vw;
        height: 3.2vw;
        margin-top: 1.6vw;
      }
    }
    .image-text_2 {
      width: 13.87vw;
      height: 6.4vw;
      margin-left: 6.4vw;
      .text-group_2 {
        width: 9.6vw;
        height: 6.4vw;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 4.26vw;
        font-family: Roboto Flex-Bold;
        font-weight: 700;
        text-align: center;
        white-space: nowrap;
        line-height: 6.4vw;
      }
      .thumbnail_2 {
        width: 3.2vw;
        height: 3.2vw;
        margin-top: 1.6vw;
      }
    }
    .image-text_3 {
      width: 14.4vw;
      height: 6.4vw;
      margin-left: 6.4vw;
      .text-group_3 {
        width: 10.14vw;
        height: 6.4vw;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 4.26vw;
        font-family: Roboto Flex-Bold;
        font-weight: 700;
        text-align: center;
        white-space: nowrap;
        line-height: 6.4vw;
      }
      .thumbnail_3 {
        width: 3.2vw;
        height: 3.2vw;
        margin-top: 1.6vw;
      }
    }
  }
  .list_1 {
    width: 90.67vw;
    height: 190.47vw;
    overflow:scroll;
    justify-content: space-between;
    margin: 7.46vw 0 11.2vw 4.8vw;
    .list-items_1 {
      width: 90.67vw;
      height: 17.07vw;
      border: 1px solid rgba(41, 41, 41, 1);
      margin-bottom: 2.14vw;
      .box_1 {
        width: 48vw;
        height: 12.8vw;
        margin: 2.13vw 0 0 2.13vw;
        .group_1 {
          width: 48vw;
          height: 6.4vw;
          .thumbnail_4 {
            width: 4.27vw;
            height: 4.27vw;
            margin-top: 1.07vw;
          }
          .text_2 {
            width: 41.6vw;
            height: 6.4vw;
            overflow-wrap: break-word;
            color: rgba(255, 255, 255, 1);
            font-size: 4.26vw;
            font-family: Roboto Flex-Bold;
            font-weight: 700;
            text-align: left;
            white-space: nowrap;
            line-height: 6.4vw;
          }
        }
        .text_3 {
          width: 25.6vw;
          height: 5.34vw;
          overflow-wrap: break-word;
          color: rgba(191, 191, 191, 1);
          font-size: 3.2vw;
          font-family: Roboto Flex-Regular;
          font-weight: normal;
          text-align: left;
          white-space: nowrap;
          line-height: 5.34vw;
          margin-top: 1.07vw;
        }
      }
      .text-group_4 {
        width: 23.2vw;
        height: 12.8vw;
        margin: 2.13vw 2.13vw 0 0;
        .text_4 {
          width: 21.34vw;
          height: 6.4vw;
          overflow-wrap: break-word;
          font-size: 4.26vw;
          font-family: Roboto Flex-Regular;
          font-weight: normal;
          text-align: right;
          white-space: nowrap;
          line-height: 6.4vw;
          margin-left: 1.87vw;
        }
        .text_5 {
          width: 23.2vw;
          height: 5.34vw;
          overflow-wrap: break-word;
          color: rgba(191, 191, 191, 1);
          font-size: 3.2vw;
          font-family: Roboto Flex-Regular;
          font-weight: normal;
          text-align: right;
          white-space: nowrap;
          line-height: 5.34vw;
          margin-top: 1.07vw;
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

    .section_2 {
      width: 234px;
      height: 24px;
      margin: 36px 0 0 26px;

      .image-text_1 {
        width: 80px;
        height: 24px;

        .text-group_1 {
          width: 64px;
          height: 24px;
          overflow-wrap: break-word;
          color: rgba(255, 255, 255, 1);
          font-size: 16px;
          font-family: 'Roboto Flex-Bold';
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 24px;
        }

        .thumbnail_1 {
          width: 12px;
          height: 12px;
          margin-top: 8px;
        }
      }

      .image-text_2 {
        width: 52px;
        height: 24px;
        margin-left: 24px;

        .text-group_2 {
          width: 36px;
          height: 24px;
          overflow-wrap: break-word;
          color: rgba(255, 255, 255, 1);
          font-size: 16px;
          font-family: 'Roboto Flex-Bold';
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 24px;
        }

        .thumbnail_2 {
          width: 12px;
          height: 12px;
          margin-top: 8px;
        }
      }

      .image-text_3 {
        width: 54px;
        height: 24px;
        margin-left: 24px;

        .text-group_3 {
          width: 40px;
          height: 24px;
          overflow-wrap: break-word;
          color: rgba(255, 255, 255, 1);
          font-size: 16px;
          font-family: 'Roboto Flex-Bold';
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          line-height: 24px;
        }

        .thumbnail_3 {
          width: 12px;
          height: 12px;
          margin-top: 8px;
        }
      }
    }

    .list_1 {
      width: 340px;
      height: 715.78px;
      overflow: scroll;
      justify-content: space-between;
      margin: 28px 0 42px 18px;

      .list-items_1 {
        width: 340px;
        height: 64px;
        border: 1px solid rgba(41, 41, 41, 1);
        margin-bottom: 8px;

        .box_1 {
          width: 180px;
          height: 34px;
          margin: 8px 0 0 8px;

          .group_1 {
            width: 180px;
            height: 24px;

            .thumbnail_4 {
              width: 16px;
              height: 16px;
              margin-top: 4px;
            }

            .text_2 {
              width: 156px;
              height: 24px;
              overflow-wrap: break-word;
              color: rgba(255, 255, 255, 1);
              font-size: 16px;
              font-family: 'Roboto Flex-Bold';
              font-weight: 700;
              text-align: left;
              white-space: nowrap;
              line-height: 24px;
            }
          }

          .text_3 {
            width: 96px;
            height: 14px;
            overflow-wrap: break-word;
            color: rgba(191, 191, 191, 1);
            font-size: 12px;
            font-family: 'Roboto Flex-Regular';
            font-weight: normal;
            text-align: left;
            white-space: nowrap;
            line-height: 14px;
            margin-top: 4px;
          }
        }

        .text-group_4 {
          width: 87px;
          height: 34px;
          margin: 8px 8px 0 0;

          .text_4 {
            width: 80px;
            height: 24px;
            overflow-wrap: break-word;
            font-size: 16px;
            font-family: 'Roboto Flex-Regular';
            font-weight: normal;
            text-align: right;
            white-space: nowrap;
            line-height: 24px;
            margin-left: 7px;
          }

          .text_5 {
            width: 87px;
            height: 14px;
            overflow-wrap: break-word;
            color: rgba(191, 191, 191, 1);
            font-size: 12px;
            font-family: 'Roboto Flex-Regular';
            font-weight: normal;
            text-align: right;
            white-space: nowrap;
            line-height: 14px;
            margin-top: 4px;
          }
        }
      }
    }
  }
}
 </style>
  