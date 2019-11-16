<template>
    <div class="partnership">
      <div class="partnershipBox">
        <div class="box" v-for="(item, index) in data" :key = index v-if="item.status ==='1' && item.upInfo.model.is_show === '1'">
          <div class="top">
            <img :src="item.thumb" alt="">
            <p>{{item.title}}</p>
            <span @click="upgrade(item)" v-if="item.upInfo.charge.price > 0">立即升级</span>
          </div>
          <div class="con">
            <div class="explain" v-html="item.descs">
            </div>
            <div class="condition" v-html="item.remark">
            </div>
          </div>
        </div>
      </div>
      <!--<div class="bot">-->
        <!--<group title="支付类型">-->
          <!--<radio :options="radio001" value="支付宝" @on-change="change"></radio>-->
        <!--</group>-->
        <!--<span>支付</span>-->
      <!--</div>-->
      <div class="boxs" v-if="dialog">
        <div class="dialog" @click="dialog = false"></div>
        <div class="way">
          <p class="t">选择支付方式</p>
          <p class="ways" @click="checkWx('wxpay')"><img src="../../assets/img/my/wx.png" alt="">微信支付</p>
          <!--<p @click="getWay('alipay')"><img src="../../assets/img/my/zfb.png" alt="">支付宝支付</p>-->
          <i class="iconfont icon-close" @click="dialog = false"></i>
        </div>
      </div>
    </div>
</template>

<script>
import { Radio, Group } from 'vux'
export default {
  name: 'partnership',
  data () {
    return {
      data: '',
      wxPara: '',
      radio001: ['支付宝', '微信'],
      value: '支付宝',
      type: '',
      dialog: false,
      index: '',
      wxCheck: ''
    }
  },
  components: {
    Radio,
    Group
  },
  methods: {
    getQueryString (name) {
      return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[, ''])[1].replace(/\+/g, '%20')) || null
    },
    getlist () {
      this.$http.get('/amoy/user/partner', {}, true).then((res) => {
        if (res.code === 0) {
          this.data = res.data
        }
      })
    },
    getWxChek () {
      this.$http.get('/wechat/user/wx-check', {}, true).then((res) => {
        if (res.code === 0) {
          this.wxCheck = res.data
          const hasCode = this.getQueryString('code')
          if (hasCode && !this.wxCheck.hasMpOpenid) {
            this.$http.post('/wechat/user/update-wx-info', {code: hasCode, device: 'mp'}, true).then((res) => {
              this.$vux.toast.text(res.msg)
              if (res.code === 0) {
                this.$http.get('/wechat/user/wx-check', {}, true).then((res) => {
                  this.wxCheck = res.data
                })
              }
            })
          }
        }
      })
    },
    upgrade (item) {
      this.index = item.id
      this.dialog = true
    },
    getWay (type) {
      this.$http.post('/amoy/user/upgrade-agent', {
        id: this.index,
        upgrade_type: 1,
        type: type,
        device: 'mp'
      }, true).then(res => {
        this.dialog = false
        if (res.code === 0) {
          this.wxPara = res.data.payOrder
          if (type === 'alipay') {
            this.plusReady(1, res.data.payOrder)
          } else {
            wx.chooseWXPay({
              timestamp: this.wxPara.timeStamp,
              nonceStr: this.wxPara.nonceStr, // 支付签名随机串，不长于 32 位
              package: this.wxPara.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: this.wxPara.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: this.wxPara.paySign, // 支付签名
              success: function (res) {
                this.$vux.toast.text('支付成功')
              }
            })
          }
        }
      })
    },
    checkWx (type) {
      if (!this.wxCheck.hasMpOpenid) {
        this.$store.commit('wechatAuthoriation', {url: '/partnership'})
      } else {
        this.getWay(type)
      }
    }
  },
  mounted () {
    // 删除
    this.getWxChek()
    this.getlist()
  }
}
</script>

<style scoped lang="less">
  .partnership{
    .partnershipBox{
      background-image: url('../../assets/img/my/bj.png');
      -webkit-background-size: 100%;
      background-size: 100%;
      padding-top: 3.7rem;
      box-sizing: border-box;
      padding-bottom: 0.1rem;
      min-height: 100%;
    }
    position: relative;
    height: 100%;
    overflow-y: auto;
    .box{
      border-radius: 5px;
      margin: 0 .2rem;
      background-color: #fff;
      overflow: hidden;
      margin-bottom: 0.5rem;
      .top{
        padding: 0 .2rem;
        height: 1rem;
        background: #3a3a3a;
        box-sizing: border-box;
        font-size: 0.3rem;
        display: flex;
        align-items: center;
        img{
          width: .5rem;
          height: .5rem;
          margin-right: .2rem;
        }
        p{
          flex: 1;
          font-size: 0.3rem;
          color: #fff;
        }
        span{
          font-size: 0.3rem;
          color: #727272;
        }
      }
      .con{
        font-size: 0.24rem;
        color: #666;
        padding:0.2rem;
        box-sizing: border-box;
        p{
          font-size: 0.28rem;
          color: #fc3357;
        }
        .condition,.explain{
          margin: 0.2rem 0;
          img{
            max-width: 100%;
          }
        }
      }
    }
    .bot{
      position: absolute;
      width: 6rem;
      background-color: #fff;
      /*height: 2rem;*/
      left: 50%;
      transform: translateX(-50%);
      border-radius: 10px;
      top: 1rem;
      padding-bottom: 0.2rem;
      span{
        display: block;
        font-size: 0.24rem;
        width: 80%;
        padding: 0.2rem;
        box-sizing: border-box;
        margin: 0 auto;
        background-color: red;
        text-align: center;
        margin-top: 0.2rem;
        border-radius: 10px;
        font-size: 0.28rem;
        color: #fff;
      }
    }
  }
  .boxs{
    .dialog{
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      height: 100%;
      position: fixed;
      left: 0;
      top: 0;
    }
    .way{
      background: #fff;
      border-radius: .1rem;
      position: fixed;
      left: .3rem;
      top: 50%;
      margin-top: -1.7rem;
      width: 6.9rem;
      font-size: .3rem;
      .icon-close{
        position: absolute;
        right: .3rem;
        top: .25rem;
        font-size: .4rem;
      }
      p{
        text-align: center;
        height: 1.15rem;
        line-height: 1.15rem;
        justify-content: center;
        display: flex;
        align-items: center;
        position: relative;
        img{
          width: .4rem;
          margin-right: .1rem;
        }
      }
      .t:after{
        content: '';
        width: 100%;
        height: 1px;
        position: absolute;
        bottom: 0;
        right: 0;
        border-bottom: 1px solid #dadada;
        transform-origin: 0 0;
        transform: scaleY(.5);
      }
      .ways:after{
        content: '';
        width: 90%;
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 5%;
        border-bottom: 1px solid #dadada;
        transform-origin: 0 0;
        transform: scaleY(.5);
      }
    }
  }
</style>
