<template>
  <div id="oauth">
    <div class="records">
      <div class="records-top">
        <img src="../../assets/img/home/oauth1.png" width="100%" alt="">
      </div>
      <div class="records-box">
        <div class="records-share">
          <img src="../../assets/img/home/oauth2.png" width="80%" alt="">
        </div>
        <h3 class="text">为提高淘宝用户的购物权益体验，应淘宝官方要求，获得返佣前请先进行官方授权！授权后将继续享有查优惠券、赚佣金特权！</h3>
      </div>
      <div class="records-btn">
        <span class="span" @click="isShowImg = !isShowImg">马上授权</span>
      </div>
      <div class="records-mask" v-if="isShowImg" @click="isShowImg = !isShowImg">
        <div class="img">
          <img src="../../assets/img/home/oauth_img.png" width="50%" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'oauth',
  data () {
    return {
      url: decodeURIComponent(this.$route.query.url),
      isShowImg: false
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   next()
  //   // 重定向功能，为解决ios微信上复制链接功能不能复制到动态路由问题
  //   // 获取地址前段部分，不算参数
  //   var replaceUrl = window.location.href.split('#')[0] + '#' + to.path;
  //   var index = 0 // 索引初始化
  //   // 给replaceUrl拼接参数
  //   for (var i in to.query) {
  //     // 判断是否等于第一个参数
  //     if (index == 0) {
  //       // 拼接地址第一个参数，添加“?”号
  //       replaceUrl += '?' + i + '=' + to.query[i]
  //     } else {
  //       // 拼接地址非第一个参数，添加“&”号
  //       replaceUrl += '&' + i + '=' + to.query[i]
  //     }
  //     index++ // 索引++
  //   }
  //   // console.log('test20190117：' + to.meta.title, replaceUrl);
  //   window.location.replace(replaceUrl) // 重定向跳转
  //   // 重定向功能------end
  // },
  mounted () {
    if (this.$utils.isWechatBrowser()) {
      console.log(this.url)
    } else {
      console.log('不在微信')
      window.location.href = this.url
    }
  }
}
</script>

<style scoped>
  .records{
    height: 100%;
    min-height: 100%;
  }
  .records-box{
    padding: 0 8%;
  }
  .records-share{
    padding: 25px 0 35px;
  }
  .text{
    line-height: 28px;
    color: #897a47;
    font-size: 16px;
    text-align: left;
  }
  .records-btn{
    position: absolute;
    width: 100%;
    bottom: 50px;
  }
  .span {
    display: block;
    width: 66%;
    height: 45px;
    line-height: 45px;
    color: #fff;
    background: -webkit-gradient(linear, left top, left bottom, from(#ff603d), color-stop(#f6483f), to(#e72041));
    background: linear-gradient(#ff603d, #f6483f, #e72041);
    font-size: 18px;
    margin: auto;
    border: 3px solid #f7be43;
    border-radius: 45px;
    text-align: center;
  }
  .records-mask{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
  }
  .records-mask .img {
    padding: 30px 20px;
    text-align: right;
  }
</style>
