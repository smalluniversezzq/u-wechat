<template>
  <div class="partnership">
    <div class="bottomBox" v-if="datas && datas.price">
      <div class="bottom">
        <div class="option" v-html="datas[0].descs" v-if="datas[0].descs">
        </div>
      </div>
      <div class="standardBox" v-if="datas.price">
        <div class="title">收费标准</div>
        <div class="standard">
          <div v-if="$bizId !== 6 && datas.price.month > 0" @click="radio('month')">月付<span>{{datas.price.month}}</span>元<span class="radio" :class="{active: index === 2}"></span></div>
          <div v-if="$bizId !== 6 && datas.price.year > 0" @click="radio('year')">年付<span>{{datas.price.year}}</span>元<span class="radio" :class="{active: index === 1}"></span></div>
          <div v-if="$bizId !== 6 && $bizId !== 12 && datas.price.forever > 0" @click="radio('forever')">永久<span>{{datas.price.forever}}</span>元<span class="radio" :class="{active: index === 3}"></span></div>
          <div v-if="($bizId === 6 || $bizId === 12) && datas.price.forever > 0" @click="radio('forever')">运营商<span>{{datas.price.forever}}</span>元<span class="radio" :class="{active: index === 3}"></span></div>
        </div>
      </div>
      <span @click="dialog = true" v-if="datas.price">立即升级</span>
    </div>
    <div class="box" v-if="dialog">
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
import { XCircle, Range, Icon, Flow, FlowState, FlowLine } from 'vux'
export default {
  name: 'upgrade-agency',
  data () {
    return {
      opposite: true,
      percent: 70,
      chang: 0,
      grow: 20,
      sum: 100,
      datas: '',
      index: 1,
      dialog: false,
      key: 'year',
      data: '',
      wxCheck: ''
    }
  },
  methods: {
    getlist () {
      this.$http.get('/amoy/user/operator', {}, true).then((res) => {
        if (res.code === 0) {
          this.datas = res.data
        }
      })
    },
    radio (type) {
      if (type === 'year') {
        this.index = 1
        this.key = 'year'
      } else if (type === 'month') {
        this.index = 2
        this.key = 'month'
      } else {
        this.index = 3
        this.key = 'forever'
      }
      console.log(this.index)
    },
    getWay (type) {
      this.$http.post('/amoy/user/upgrade-agent', {
        upgrade_type: 2,
        term: this.key,
        type: type,
        id: this.datas[0].id,
        device: 'mp'
      }, true).then(res => {
        this.dialog = false
        if (res.code === 0) {
          this.data = res.data.payOrder
          if (type === 'wxpay') {
            wx.chooseWXPay({
              timestamp: this.data.timeStamp,
              nonceStr: this.data.nonceStr, // 支付签名随机串，不长于 32 位
              package: this.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: this.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: this.data.paySign, // 支付签名
              success: function (res) {
                this.$router.push('/payGiftBagSuccess')
              }
            })
          } else {
            // this.plusReady(0, res.data.payOrder)
          }
        }
      })
    },
    getQueryString (name) {
      return decodeURIComponent((new RegExp('[?|&]'+name+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[, ''])[1].replace(/\+/g, '%20')) || null
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
    checkWx (type) {
      if (!this.wxCheck.hasMpOpenid) {
        this.$store.commit('wechatAuthoriation', {url: '/upgradeAgency'})
      } else {
        this.getWay(type)
      }
    },
    // 获取支付通道
    plusReady (index, data) {
      let that = this
      if (index === 1) {
        let aliPayPlus
        if (this.$aliPay === 1) {
          aliPayPlus = api.require('aliPayTradePlus')
        } else {
          aliPayPlus = api.require('aliPayPlus')
        }
        aliPayPlus.payOrder({
          orderInfo: data
        }, function (ret, err) {
          switch (ret.code) {
            case '9000':
              that.$vux.toast.text('支付成功')
              setTimeout(() => {
                that.$router.go(-1)
              }, 2000)
              break
            case '6001':
              that.$vux.toast.text('取消支付')
              break
            case '8000':
              that.$vux.toast.text('正在处理中')
              break
            default:
              that.$vux.toast.text('支付失败')
          }
        })
      } else {
        let wxPay = api.require('wxPay')
        let info = {
          apiKey: data.appid,
          orderId: data.prepayid,
          mchId: data.partnerid,
          nonceStr: data.noncestr,
          timeStamp: data.timestamp,
          sign: data.sign
        }
        wxPay.payOrder(info, function (ret, err) {
          if (ret.status) {
            that.$vux.toast.text('支付成功')
          } else {
            console.log(JSON.stringify(err))
            if (err.code === -2) {
              that.$vux.toast.text('取消支付')
            } else {
              that.$vux.toast.text('支付失败')
            }
          }
        })
      }
    },
    pay (id, data) {
      console.log(data.toString())
      console.log(this.channel)
      plus.payment.request(this.channel, data, (result) => {
        this.$vux.toast.show('支付成功')
      }, (error) => {
        console.log(error.toString())
        if (error.message && (error.message.indexOf('canceled') > -1 || error.message.indexOf('取消') > -1)) {
          this.$vux.toast.text('支付已取消')
        } else {
          this.$vux.toast.text('支付失败：' + error.message)
        }
      })
    }
  },
  mounted () {
    // 删除
    this.getlist()
    this.getWxChek()
  },
  components: {
    XCircle,
    Range,
    Icon,
    Flow,
    FlowState,
    FlowLine
  },
  directives: {
    focus: {
      inserted (el, bindings) {
        let ratio = bindings.value
        el.style.width = ratio + '%'
      }
    }
  }
}
</script>

<style scoped lang="less">
  .partnership{
    height: 100%;
    background-image: url('../../assets/img/my/bj.png');
    -webkit-background-size: 100%;
    background-size: 100%;
    padding-top: 3.7rem;
    box-sizing: border-box;
    padding-bottom: 0.4rem;
    .box{
      border-radius: 5px;
      margin: 0 .2rem;
      background-color: #fff;
      overflow: hidden;
      margin-bottom: 0.5rem;
      font-size: 0.26rem;
      color: #666666;
      padding: 0.4rem 0.2rem;
      box-sizing: border-box;
      padding-bottom: 0.24rem;
      p{
        margin-bottom: 0.16rem;
      }
    }
    .bottomBox{
      background-color: #fff;
      margin: 0 .2rem;
      padding-bottom: 0.8rem;
      border-radius: 6px;
      border: 1px solid #fff;
      >p{
        font-size: 0.24rem;
        text-align: center;
        color: #999999;
      }
      .standardBox{
        background: #fff url('../../assets/img/my/beijing.png') 0 0 no-repeat;
        -webkit-background-size: 100%;
        background-size: 100%;
        margin: 0.2rem;
        font-size: 0.28rem;
        padding: 0.2rem 0;
        box-sizing: border-box;
        height: 2rem;
        .title{
          text-align: center;
          font-size: 0.3rem;
          font-weight: 700;
        }
        .standard{
          display: flex;
          margin-top: 0.2rem;
          justify-content: center;
          div{
            position: relative;
            /*flex: 1;*/
            text-align: center;
            padding-right: 0.2rem;
            width: 33.33%;
            span{
              color: #fb3458;
            }
          }
          .radio{
            background: #fff;
            position: absolute;
            width: 0.2rem;
            height: 0.2rem;
            border-radius: 50%;
            /*border: 2px solid black;*/
            top: 0.11rem;
            right: 0.22rem;
          }
          .active{
            background-image: url("../../assets/img/my/select.png");
            background-size: contain;
            background-position: bottom;
          }
        }
      }
      >span{
        display: block;
        margin: 0 0.2rem;
        height: 0.9rem;
        text-align: center;
        line-height: 0.9rem;
        background-color: #fc3357;
        font-size: 0.32rem;
        color: #fff;
        border-radius: 24px;
        margin-top: 0.6rem;
      }
    }
  }
  .bottom{
    margin-top: 0.2rem;
    padding: 0 0.3rem;
    box-sizing: border-box;
    background-color: #fff;
    .header{
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.28rem;
      text-align: center;
      position: relative;
    }
    .header:before{
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: #ebebeb;
    }
    .option{
      width: 100%;
      .row{
        display: flex;
        position: relative;
        >div{
          flex: 1;
          height: 3.2rem;
          div{
            font-size: 0.28rem;
          }
          .texts{
            span{
              display: block;
              text-align: center;
            }
            .people{
              display: inline-block;
              color: #f93f60;
            }
          }
        }
        >div:nth-child(1){
          position: relative;
        }
        >div:nth-child(1):before{
          content: '';
          position: absolute;
          width: 1px;
          height: 70%;
          background-color: #ebebeb;
          right: 0;
          top: 0.36rem;
        }
      }
      .row:nth-child(1):before{
        content: '';
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #ebebeb;
        left: 0;
        bottom: 0;
      }
    }
  }
  .box{
    .dialog{
      background: rgba(0, 0, 0, 0.4);
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .way{
      background: #fff;
      border-radius: .1rem;
      position: absolute;
      left: .3rem;
      top: 50%;
      margin-top: -1.75rem;
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
