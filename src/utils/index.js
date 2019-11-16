export const storage = {
  set: function (key, data) {
    try {
      if (window.api) {
        // 有全局api对象时原生也存储一下
        api.setPrefs({key: key, value: JSON.stringify(data)})
      }
      return window.localStorage.setItem(key, window.JSON.stringify(data))
    } catch (err) {
      if (window.api) {
        // 有全局api对象时原生也存储一下
        api.setPrefs({key: key, value: data})
      }
      return window.localStorage.setItem(key, data)
    }
  },
  get: function (key) {
    if (window.api) {
      // 有全局api对象时用原生存储
      try {
        return JSON.parse(api.getPrefs({sync: true, key: key}))
      } catch (err) {
        return api.getPrefs({sync: true, key: key})
      }
    } else {
      // 没有全局api对象时
      try {
        return window.JSON.parse(window.localStorage.getItem(key))
      } catch (err) {
        return window.localStorage.getItem(key)
      }
    }
  },
  remove: function (key) {
    if (window.api) {
      api.removePrefs({key: key})
      window.localStorage.removeItem(key)
    } else {
      return window.localStorage.removeItem(key)
    }
  }
}
export function copyText (text) {
  return new Promise(function (resolve, reject) {
    // 复制链接
    var input = document.createElement('input')
    input.value = text
    document.body.appendChild(input)
    input.select()
    input.setSelectionRange(0, input.value.length)
    document.execCommand('Copy')
    document.body.removeChild(input)
    resolve()
  })
}
/*
* 以键值对获取url中的参数
* */
export function getQuery () {
  var url = location.search // 获取url中"?"符后的字串
  var theRequest = new Object()
  if (url.indexOf('?') !== -1) {
    var str = url.substr(1)
    var strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
    }
  }
  return theRequest
}
/*
* 判断是否是微信浏览器
* */
export function isWechatBrowser () {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
}
