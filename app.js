//app.js
// var baseUrl = 'https://shunyu.zjaga.com/cloud';  //舜宇
// var baseUrl = 'https://ny.yfl360.com/cloud';  //鑫海
var baseUrl = 'http://192.168.10.25:8092';  //鑫海

App({
  onLaunch: function () {
    // wx.getUpdateManager 在 1.9.90 才可用，请注意兼容
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.globalData.platform = res.platform;
        let { model: modelmes } = res;
        let _this = this;
        let iphoneArr = new Set(['iPhone X', 'iPhone 11', 'iPhone 12<iPhone13,2>', 'iPhone 11 Pro Max']); //机型
        if (iphoneArr.has(modelmes)) _this.globalData.isIphoneX = true;
      }
    })
  },
  HttpPostSend1: function (url, data, cb) {
    var tUrl = baseUrl + url;
    wx.request({
      url: tUrl,
      data: data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      }, // 设置请求的 header,会对数据进行JSON序列化
      success: function (res) {
        return cb(res.data);
      },
      fail: function (res) {
        var warnMsg = {
          title: "网络通讯超时",
          duration: 2000,
          icon: 'success'
        };
        wx.showToast(warnMsg);
      },
      complete: function (res) {
        //complete
      }
    });
  },
  HttpPostSend: function (url, data, cb) {
    var tUrl = baseUrl + url;
    wx.request({
      url: tUrl,
      data: data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'auth-token': wx.getStorageSync('auth-token')
      }, // 设置请求的 header,会对数据进行JSON序列化
      success: function (res) {
        if(res.data.status==401){
          that.showTipMsgNone(res.data.msg)
          wx.setStorageSync('auth-token', '')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }, 500);
        }else{
          return cb(res.data);
        }
      },
      fail: function (res) {
        var warnMsg = {
          title: "网络通讯超时",
          duration: 2000,
          icon: 'success'
        };
        wx.showToast(warnMsg);
      },
      complete: function (res) {
        //complete
      }
    });
  },
  HttpGetSend: function (url, data, cb) {
    let that = this;
    var tUrl = baseUrl + url;
    wx.request({
      url: tUrl,
      data: data,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'auth-token': wx.getStorageSync('auth-token')
      }, // 设置请求的 header,会对数据进行JSON序列化
      success: function (res) {
        if(res.data.status==401){
          that.showTipMsgNone(res.data.msg)
          wx.setStorageSync('auth-token', '')
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }, 500);
        }else{
          return cb(res.data);
        }
      },
      fail: function (res) {
        var warnMsg = {
          title: "网络通讯超时",
          duration: 2000,
          icon: 'success'
        };
        wx.showToast(warnMsg);
      },
      complete: function (res) {
        //complete
      }
    });
  },
  showTipMsg: function (msg) {
    var warnMsg = {
      title: msg,
      duration: 2000,
      icon: 'success',
    };
    wx.showToast(warnMsg);
  },
  showTipMsgNone: function (msg) {
    var warnMsg = {
      title: msg,
      duration: 2000,
      icon: 'none',
    };
    wx.showToast(warnMsg);
  },
  globalData: {
    openid: '',
    // socketUrl: 'wss://shunyu.zjaga.com/cloud',
    // socketUrl: 'wss://ny.yfl360.com/cloud',
    socketUrl: 'ws://192.168.10.25:8092',    
    token: '',
    platform: '',
    userInfo: null,
    shareOptions: {},
    params: {
    },
    complain_category: [],
  },
  onLoad(options) {
    this.setData({
      title: options.title
    })
  }
})
