// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import plugin from './plugin'
import http from './api/http'
import Vuex from 'vuex'
import Clipboard from 'v-clipboard'
import VueLazyload from 'vue-lazyload'
import {XHeader, ToastPlugin, ConfirmPlugin, LoadingPlugin, DatetimePlugin} from 'vux'
import '../static/libs/iconfont/iconfont.css'
import VueScroller from 'vue-scroller'
import './pages/mall/home/home.less'
import './pages/mall/my/my.less'
import 'swiper/dist/css/swiper.css'
import * as utils from './utils'
import Vconsole from 'vconsole'

require('./api/mock.js')
Vue.use(Clipboard).use(Vuex).use(ToastPlugin, {position: 'bottom'}).use(ConfirmPlugin).use(DatetimePlugin).use(LoadingPlugin).use(VueScroller)
Vue.prototype.$http = http
Vue.prototype.$utils = utils
Vue.prototype.$img = utils.storage.get('defaultImg') ? utils.storage.get('defaultImg') : require('@/assets/img/bg.png')
Vue.use(VueLazyload, {
  loading: utils.storage.get('defaultImg') ? utils.storage.get('defaultImg') : require('@/assets/img/bg.png'),
  preLoad: 2,
  error: utils.storage.get('errorImg') ? utils.storage.get('errorImg') : require('@/assets/img/error.png'),
  adapter: 1
})
Vue.prototype.$logo = utils.storage.get('appLoginLogo') ? utils.storage.get('appLoginLogo') : ''
http.post('/amoy/app/info', {}, false).then(res => {
  if (res.code === 0) {
    if (res.data.defaultImg.DEFAULT_IMG) {
      utils.storage.set('defaultImg', res.data.defaultImg.DEFAULT_IMG)
    }
    if (res.data.defaultImg.FAILURE_IMG) {
      utils.storage.set('errorImg', res.data.defaultImg.FAILURE_IMG)
    }
    utils.storage.set('appLoginLogo', res.data.appLoginLogo)
    Vue.prototype.$logo = res.data.appLoginLogo
    Vue.prototype.$isCouponPass = res.data.isCouponPass
    Vue.prototype.$isInviteOpen = res.data.isInviteOpen
    Vue.prototype.$up_operator = res.data.up_operator
    Vue.prototype.$img = res.data.defaultImg.DEFAULT_IMG ? res.data.defaultImg.DEFAULT_IMG : require('@/assets/img/bg.png')
    Vue.use(VueLazyload, {
      loading: res.data.defaultImg.DEFAULT_IMG ? res.data.defaultImg.DEFAULT_IMG : require('@/assets/img/bg.png'),
      preLoad: 2,
      error: res.data.defaultImg.FAILURE_IMG ? res.data.defaultImg.FAILURE_IMG : require('@/assets/img/error.png'),
      adapter: 1
    })
  } else {
    Vue.prototype.$img = require('@/assets/img/bg.png')
    Vue.use(VueLazyload, {
      loading: require('@/assets/img/bg.png'),
      preLoad: 2,
      error: require('@/assets/img/error.png'),
      adapter: 1
    })
  }
})

// 右滑相关代码 —————————————start—————————————————
window.canRightSlipBack = true
Vue.prototype.rightSlip = function () {
  if (window.canRightSlipBack) {
    if (api.pageParam.backToWin) {
      // 当界面有别的window可返回，不做拦截，通过原生的右滑返回来处理
    } else {
      router.go(-1)
    }
  }
}
Vue.prototype.forbidRightSlip = function () {
  window.canRightSlipBack = false
}
Vue.prototype.allowRightSlip = function () {
  console.log(1)
  setTimeout(() => {
    window.canRightSlipBack = true
  }, 3000)
}
function vueTouch (el, binding, type) {
  var _this = this
  this.obj = el
  this.binding = binding
  this.touchType = type
  this.vueTouches = {
    x: 0,
    y: 0
  }
  this.vueMoves = true
  this.vueLeave = true
  this.vueCallBack = typeof (binding.value) === 'object' ? binding.value.fn : binding.value
  this.obj.addEventListener('touchstart', function (e) {
    _this.start(e)
  }, false)
  this.obj.addEventListener('touchend', function (e) {
    _this.end(e)
  }, false)
  this.obj.addEventListener('touchmove', function (e) {
    _this.move(e)
  }, false)
  this.start = function (e) {
    this.vueMoves = true
    this.vueLeave = true
    this.longTouch = true
    this.vueTouches = {
      x: e.changedTouches[0].pageX,
      y: e.changedTouches[0].pageY
    }
    this.time = setTimeout(function () {
      if (this.vueLeave && this.vueMoves) {
        this.touchType === 'longtap' && this.vueCallBack(this.binding.value, e);
        this.longTouch = false
      };
    }.bind(this), 1000)
  }
  this.end = function (e) {
    var disX = e.changedTouches[0].pageX - this.vueTouches.x
    var disY = e.changedTouches[0].pageY - this.vueTouches.y
    clearTimeout(this.time)
    if (Math.abs(disX) > 30 || Math.abs(disY) > 100) {
      this.touchType === 'swipe' && this.vueCallBack(this.binding.value, e)
      if (Math.abs(disX) > (Math.abs(disY)) * 2) {
        if (disX > 30) {
          this.touchType === 'swiperight' && this.vueCallBack(this.binding.value, e)
        };
        if (disX < -30) {
          this.touchType === 'swipeleft' && this.vueCallBack(this.binding.value, e)
        };
      } else {
        if (disY > 10) {
          this.touchType === 'swipedown' && this.vueCallBack(this.binding.value, e)
        };
        if (disY < -10) {
          this.touchType === 'swipeup' && this.vueCallBack(this.binding.value, e)
        };
      };
    } else {
      if (this.longTouch && this.vueMoves) {
        this.touchType === 'tap' && this.vueCallBack(this.binding.value, e);
        this.vueLeave = false
      };
    };
  }
  this.move = function (e) {
    this.vueMoves = false
  }
};

Vue.directive('swiperight', {
  bind: function (el, binding) {
    new vueTouch(el, binding, 'swiperight')
  }
})
// 右滑相关代码 —————————————end—————————————————

Vue.component('x-header', XHeader)

Vue.use(plugin, {router: router})

Vue.config.productionTip = false
Vue.prototype.link = window.location.origin + '/api/' + config.bizId
Vue.prototype.$color = '#fc3357'
// 控制线下的内容是否开启
Vue.prototype.$isMallUnderShop = false
// 支付宝支付模块
Vue.prototype.$aliPay = 1
Vue.prototype.$bizId = config.bizId
// 控制线上的内容是否开启
Vue.prototype.$isMallShop = false

window.apiready = function () {
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  })
  function getDesign () {
    http.post('/amoy/app/design', {
      type: 1,
      device: 3
    }, true, true).then(res => {
      if (res.code === 0) {
        if (res.data.footer) {
          store.commit('setFooter', JSON.parse(res.data.footer))
        }
        if (res.data.content) {
          store.commit('setContent', JSON.parse(res.data.content))
        }
        if (res.data.theme) {
          store.commit('setTheme', JSON.parse(res.data.theme))
        }
        store.commit('setFirstNav', '/home')
        if (res.data.content) {
          let content = JSON.parse(res.data.content)
          for (let i = 0; i < content.length; i++) {
            if (content[i].name === 'edit-header') {
              store.commit('setSearch', content[i].params)
            } else if (content[i].name === 'edit-goods-list') {
              store.commit('setGoodsList', content[i].params)
            } else if (content[i].name === 'edit-xf-button') {
              store.commit('setFloating', content[i].params)
              if (content[i].params && content[i].params.items) {
                for (let j in content[i].params.items) {
                  if (content[i].params.items[j].img) {
                    api.openFrame({
                      name: 'suspend_icon',
                      url: 'widget://html/suspend_icon.html',
                      rect: {
                        w: 70,
                        h: 70,
                        marginRight: 0,
                        marginBottom: 200
                      },
                      pageParam: {
                        img: content[i].params.items[j].img,
                        link: content[i].params.items[j].link
                      }
                    })
                  }
                }
              }
            }
          }
        }
        http.post('/amoy/app/design', {
          type: 2,
          device: 3
        }, true, true).then(res => {
          if (res.code === 0 && res.data.content) {
            store.commit('setMyContent', JSON.parse(res.data.content))
          }
        })
      }
    })
  }
  getDesign()
}

if (utils.isWechatBrowser()) {
  // 微信浏览器中
  weixinInit()
} else {
  // 非微信浏览器中
  window.apiready()
}

function weixinInit () {
// 获取jssdk
  http.post('/wechat/auth/jssdk', {
    url: encodeURIComponent(location.href.split('#')[0])
  }, false).then(res => {
    wx.config({
      debug: res.data.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: res.data.appId, // 必填，公众号的唯一标识
      timestamp: res.data.timestamp, // 必填，生成签名的时间戳
      nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
      signature: res.data.signature, // 必填，签名
      jsApiList: res.data.jsApiList // 必填，需要使用的JS接口列表
    })
    wx.ready(() => {
      getShareOption()
    })
    wx.error((res) => {
      console.log('微信配置失败：', res)
    })
  })
}
/*
*  获取后台分享配置
* */
function getShareOption () {
  http.post('/amoy/user/invite', {}, false).then(res => {
    window.apiready()
    console.log('getShareOption>res: ', res)
    // 配置分享给朋友内容
    wx.onMenuShareAppMessage({
      title: res.data.appDownTitle, // 分享标题
      desc: res.data.appDownDesc, // 分享描述
      imgUrl: res.data.appDownLogo, // 分享图标
      success: function () {
        console.log('分享到好友成功')
      }
    })
    // 配置分享到朋友圈
    wx.onMenuShareTimeline({
      title: res.data.appDownTitle, // 分享标题
      desc: res.data.appDownDesc, // 分享描述
      imgUrl: res.data.appDownLogo,
      success: function () {
        // 设置分享给好友成功
        console.log('分享到朋友圈成功')
      }
    })
  })
}
