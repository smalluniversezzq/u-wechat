<template>
  <div id="wechat_login">
    <i class="iconfont icon-close" @click="goBack"></i>
    <div class="wechat_login_img">
      <img :src="$logo" v-if="$logo" alt="">
    </div>
    <div class="edit_button" v-if="wx">
      <button class="btn_bright_red" @click="wechatLogin()" :style="{background: $store.state.global.theme.mainColor}">
        <img src="../../assets/img/auth/wechat.png" alt="">
        微信登录
      </button>
    </div>
    <div class="edit_button" v-else>
      <button class="btn_bright_red"  @click="jumpTo('/login')" :style="{background: $store.state.global.theme.mainColor}">
        登录
      </button>
    </div>
    <ul class="wechat_login_enroll">
      <li class="li1" :style="{color: $store.state.global.theme.mainColor}"  @click="jumpTo('/register')">注册账号</li>
      <span :style="{color: $store.state.global.theme.mainColor}" >|</span>
      <li class="li2" :style="{color: $store.state.global.theme.mainColor}"  @click="jumpTo('/login')">手机登录</li>
    </ul>
    <p class="wechat_login_protocol">登录注册即表示同意 <span @click="jumpTo('/about?title=用户使用协议&type=7')">《用户使用协议》</span></p>
  </div>
</template>

<script>
export default {
  name: 'wechatLogin',
  data () {
    return {
      wx: true,
      data: '',
      auth: {},
      auths: {},
      authBtns: ['weixin'],
      loading: false,
      vuegConfig: {
        disable: false
      }
    }
  },
  inject: ['reload'],
  methods: {
    wechatLogin () {
      this.$store.commit('wechatAuthoriation')
    },
    wechatBaseLogin () {
      this.$store.commit('wechatAuthoriation', {url: '/login'})
      // window.location.href = window.location.origin + '/api/1/wechat/auth/base-login?url=/login'
    }
  }
}
</script>

<style scoped lang="less">
  #wechat_login{
    height: 100%;
    background: #fff;
    overflow-y: auto;
    .icon-close{
      position: absolute;
      right: .5rem;
      top: .7rem;
      font-size: .3rem;
    }
  }
</style>
