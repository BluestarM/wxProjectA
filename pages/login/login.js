// pages/login/login.js
import {
  user_login
} from "../../utils/api.js"

const app = getApp()
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    TaskShow2: 0, //0隐藏 1显示授权遮罩层 
    TaskShow3: 0, //0隐藏 1显示授权手机号遮罩层
    error: '',
    formData: {

    },
    rules: [{
      name: 'username',
      rules: { required: true, message: '账号是必填项' },
    }, {
      name: 'password',
      rules: { required: true, message: '密码是必填项' },
    }],
    isHiddenMsg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  cancelTap: function (e) {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  formInputChange(e) {
    const { field } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },

  outTap: function (e) {
    const that = this
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })
        }
      } else {
        let params = that.data.formData;
        wx.showLoading({
          title: '请求加载中...',
        });
        app.HttpPostSend(
          user_login, params,
          function (result_data) {
            wx.hideLoading();
            if (result_data.status != 200) {
              app.showTipMsgNone(result_data.msg);
            } else {
              wx.setStorageSync('auth-token', result_data.data)
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/home/home',
                })
              }, 1000)
            }
          })

      }
    })
  },

  //关闭登录弹框
  closeTask: function (e) {
    this.setData({
      TaskShow2: 0
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

})