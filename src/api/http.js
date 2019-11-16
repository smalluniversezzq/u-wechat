import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import router from '../router/index'
import qs from 'qs'

axios.defaults.timeout = 5000
axios.defaults.baseURL = window.location.origin + '/api/' + config.bizId

// 设置默认请求头
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-type': 'application/x-www-form-urlencoded'
}
// 序列化参数
axios.defaults.transformRequest = (data) => {
  data = qs.stringify(data)
  return data
}
let cancel = {}
let promiseArr = {}
const CancelToken = axios.CancelToken

// http request 拦截器1
axios.interceptors.request.use(
  config => {
    // 发起请求时，取消掉当前正在进行的相同请求
    if (promiseArr[config.url]) {
      promiseArr[config.url]('操作取消')
      promiseArr[config.url] = cancel
    } else {
      promiseArr[config.url] = cancel
    }
    const token = store.state.user.token
    if (token) {
      config.headers.token = token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    response = response.data
    if (response.code === 403) {
      // Vue.$vux.toast.text(response.msg, 'top')
      store.commit('logout')
      // 只有在当前路由不是登录页面才跳转
      router.currentRoute.name !== 'wechatLogin' && router.replace({
        path: 'wechatLogin'
      })
    } else {
      return response
    }
  },
  error => {
    if (error.response) {
      console.log(error)
      switch (error.response.status) {
        case 403:
          // 403 清除token信息并跳转到登录页面
          store.commit('logout')
          // 只有在当前路由不是登录页面才跳转
          router.currentRoute.name !== 'wechatLogin' && store.commit('wechatAuthoriation')
          break
        default:
          error.message = `连接错误：${error.response.status}`
      }
    }
    return Promise.reject(error)
  }
)

export default {
  // get请求
  get (url, param, loading) {
    return new Promise((resolve, reject) => {
      if (loading) {
        store.commit('show')
      }
      if (!param) {
        param = {}
      }
      axios({
        method: 'get',
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        if (loading) {
          store.commit('hide')
        }
        if (res.code === 0) {
          resolve(res)
        } else {
          Vue.$vux.toast.text(res.msg)
        }
      }).catch(error => {
        if (Vue.$vux.loading) {
          Vue.$vux.loading.hide()
        }
        console.log(error)
        // if (error.message) {
        Vue.$vux.toast.text(error.message, 'top')
        // }
      })
    })
  },
  // post请求
  post (url, param, loading, show) {
    return new Promise((resolve, reject) => {
      if (loading) {
        store.commit('show')
      }
      if (!param) {
        param = {}
      }
      axios({
        method: 'post',
        url,
        data: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        if (loading) {
          store.commit('hide')
          // activity.closeKeyFrame()
          // store.commit('hide')
        }
        if (!res) {
          return
        }
        if (res.code === 0) {
          resolve(res)
        } else {
          if (show) {
            resolve(res)
          } else {
            Vue.$vux.toast.text(res.msg)
          }
        }
      }).catch(error => {
        if (loading) {
          store.commit('hide')
        }
        if (Vue.$vux.loading) {
          Vue.$vux.loading.hide()
        }
        if (error.message !== '操作取消') {
          resolve(error)
        }
        console.log(error)
        // if (error.message) {
        // Vue.$vux.toast.text(error.message, 'top')
        // }
      })
    })
  }
}
