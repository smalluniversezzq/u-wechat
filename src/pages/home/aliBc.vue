<template>
    <div class="aliBc">
      <x-header :left-options="{showBack: false}"><a slot="left" @click="goBack()"  class="backBox">
        <i class="iconfont icon-back"></i></a>
        {{title}}<span class="save" slot="right"  id="aliBcReload" @click="closeAli">关闭</span>
      </x-header>
    </div>
</template>

<script>
export default {
  name: 'aliBc',
  components: {},
  data () {
    return {
      title: this.$route.query.title
    }
  },
  methods: {
    goBack () {
      let that = this
      let aliBC = api.require('aliBC')
      aliBC.webGoBack(function (ret, err) {
        aliBC.removeWeb()
        api.closeFrame()
        that.$router.go(-1)
      })
      // let browser = api.require('webBrowser')
      // browser.historyBack(
      //   function (ret, err) {
      //     if (!ret.status) {
      //       browser.closeView()
      //       that.$router.go(-1)
      //     }
      //   }
      // )
    },
    closeAli () {
      let aliBC = api.require('aliBC')
      aliBC.removeWeb()
      api.closeFrame()
      this.$router.go(-1)
      // window.location.reload()
      // let aliBC = api.require('aliBC')
      // aliBC.addJsToPage({
      //   javaScript: 'javascript:{window.location.reload()}'
      // }, function (ret, err) {
      // })
    }
  },
  mounted () {
    // let that = this
    api.openWin({
      name: 'aliWin',
      url: '../html/main.html',
      bounces: false,
      slidBackEnabled: false,
      allowEdit: true
    })
  }
}
</script>
<style lang="less">
  /*.aliBc{*/
    /*position: relative;*/
    /*#aliBcReload{*/
      /*color: #666;*/
    /*}*/
    /*.vux-header{*/
      /*position: fixed !important;*/
      /*z-index: 100000000000000;*/
    /*}*/
  /*}*/
</style>
