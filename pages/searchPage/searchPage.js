// pages/searchPage/searchPage.js
import {
  device_tree
} from "../../utils/api.js"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectArray: []
  },

  tapItem: function (e) {
    var itemid = e.detail.itemid;
    var itemval = e.detail.value;

    itemid = itemid.split('_')[0]
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      deviceId: itemid,
      deviceName: itemval
    })
    if(prevPage.connection) prevPage.connection(); 
    wx.navigateBack({
      url: '/pages/deviceReport/deviceReport'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;    
    app.HttpGetSend(
      device_tree, {},
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          that.setData({
            selectArray: result_data.data
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})