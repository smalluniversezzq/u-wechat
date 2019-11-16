import * as utils from '../../utils'

const state = {
  footer: utils.storage.get('footer'),
  content: utils.storage.get('content'),
  appLoginLogo: utils.storage.get('appLoginLogo'),
  floating: null,
  myContent: null,
  search: {bgDeg: '90', bgColor: '#fc3357', bgSecondColor: '#fc3357', color: '#fff', searchPlaceholder: '请输入关键字'},
  theme: {deg: '90', mainColor: '#FF5847', secondColor: '#fe6868', thirdColor: '#ffe7e9'},
  mallFooter: utils.storage.get('mallFooter'),
  mallContent: utils.storage.get('mallContent'),
  mallSearch: utils.storage.get('mallSearch'),
  mallHot: null,
  mallMy: utils.storage.get('mallMy'),
  firstNav: '/home',
  block: null,
  swiperProgress: null,
  goodsList: null
}

const getters = {}

const actions = {}

const mutations = {
  setFooter (state, data) {
    utils.storage.set('footer', data)
    state.footer = data
  },
  setContent (state, data) {
    utils.storage.set('content', data)
    state.content = data
  },
  setFloating (state, data) {
    utils.storage.set('floating', data)
    state.floating = data
  },
  setTheme (state, data) {
    state.theme = data
  },
  setSearch (state, data) {
    state.search = data
  },
  setGoodsList (state, data) {
    utils.storage.set('goodsList', data)
    state.goodsList = data
  },
  setMallFooter (state, data) {
    utils.storage.set('mallFooter', data)
    state.mallFooter = data
  },
  setMallContent (state, data) {
    utils.storage.set('mallContent', data)
    state.mallContent = data
  },
  setMallSearch (state, data) {
    utils.storage.set('mallSearch', data)
    state.mallSearch = data
  },
  setMallHot (state, data) {
    utils.storage.set('mallHot', data)
    state.mallHot = data
  },
  setMallMy (state, data) {
    utils.storage.set('mallMy', data)
    state.mallMy = data
  },
  setBlock (state, data) {
    state.block = data
  },
  setFirstNav (state, data) {
    state.firstNav = data
  },
  setMyContent (state, data) {
    state.myContent = data
  },
  setSwiperProgress (state, data) {
    state.swiperProgress = data
  },
  removeWechatCode (state, data) {
    // 清除链接中的code参数。replaceState修改链接的同时可以不触发页面跳转
    let url = location.href.replace(/code=[\w^]*/i, '')
    window.history.replaceState({}, document.title, url)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
