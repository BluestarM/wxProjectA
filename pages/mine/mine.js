// pages/mine/mine.js
import {
  user_infos,
  user_logout
} from "../../utils/api.js"

const app = getApp()
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    TaskShow2: 0, //0隐藏 1显示授权遮罩层 
    TaskShow3: 0, //0隐藏 1显示授权手机号遮罩层
    userInfo: {},
    buttons: [{ text: '取消' }, { text: '确定' }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let token = wx.getStorageSync('auth-token')
    if(token){
      app.HttpGetSend(
        user_infos, {},
        function (result_data) {
          if (result_data.status != 200) {
            app.showTipMsgNone(result_data.msg);
          } else {
            that.setData({
              userInfo: result_data.data
            })
          }
        })
    }else{
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  tapDialogButton(e) {
    this.setData({
      dialogShow: false
    })
    if (e.detail.index == 1) {
      wx.showLoading({
        title: '请求加载中...',
      });
      
      app.HttpGetSend(
        user_logout, {},
        function (result_data) {
          if (result_data.status != 200) {
            app.showTipMsgNone(result_data.msg);
          } else {
            wx.clearStorage({
              success: (res) => {
                app.showTipMsg('退出成功！');
                wx.hideLoading();
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/login/login',
                  })
                }, 1000)
              },
            })
          }
        })
      
    }
  },

  outTap: function (e) {
    this.setData({
      dialogShow: true
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