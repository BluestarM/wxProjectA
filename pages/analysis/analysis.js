// pages/analysis/analysis.js
import {
  tunnel_nergyTotal,
  tunnel_degreeFlow
} from "../../utils/api.js"
const util = require('../../utils/util.js');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    isOpen: true,
    isChecked: false,
    reportlist: [
      { name: '当前总功率', value: '', unit: 'kW·h' }, { name: '累计流量', value: '', unit: 'm³' },
      { name: '累计总电度', value: '', unit: 'kW·h' }, { name: '累计总电费', value: '', unit: '￥' },
      { name: '平均电气比', value: '', unit: 'kW·h/Nm³' }, { name: '标准电气比', value: '', unit: 'kW·h/Nm³' },
      { name: '平均节能', value: '', unit: 'kW·h' }, { name: '累计节能', value: '', unit: 'kW·h' },
      { name: '系统浪费总数', value: '' }, { name: '分项-空载浪费', value: '' },
      { name: '分项-空压机压力浪费', value: '' }, { name: '分项-假性需求压力浪费', value: '' }],
    tabActive: 1,
    title: '',
    date: '',
    tunnelId: '',
    deviceId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      title: options.title,
      date: util.formatDate(new Date())
    })
  },

  // 下拉选择日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    this.getTestList();
    this.getTestList2();
  },

  getTestList: function (e) {
    const that = this
    let params = {};
    params.projectId = wx.getStorageSync('projectId');
    params.tunnelId = that.data.tunnelId;
    params.deviceId = that.data.deviceId;
    params.startDate = that.data.date + ' 00:00:00';
    params.endDate = that.data.date + ' 23:59:59';
    wx.showLoading({
      title: '加载中...',
    });
    app.HttpGetSend(
      tunnel_nergyTotal, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let reportlist = that.data.reportlist;
          let data = result_data.data;
          if (data) {
            reportlist[0].value = data.realPower ? (data.realPower).toFixed(0) : 0
            reportlist[1].value = data.flow ? (data.flow).toFixed(0) : 0
            reportlist[2].value = data.degree ? (data.degree).toFixed(0) : 0
            reportlist[3].value = data.fee ? (data.fee).toFixed(0) : 0
            // reportlist[4].value = data.avgPercent ? (data.avgPercent).toFixed(3) : 0
            reportlist[5].value = data.standerDqb ? (data.standerDqb).toFixed(3) : 0
            // reportlist[6].value = data.avgSavingEnergy ? (data.avgSavingEnergy).toFixed(2) : 0
            // reportlist[7].value = data.sumSavingEnergy ? (data.sumSavingEnergy).toFixed(2) : 0
            reportlist[8].value = data.allWaste ? (data.allWaste).toFixed(0) : 0
            reportlist[9].value = data.unloadWaste ? (data.unloadWaste).toFixed(0) : 0
            reportlist[10].value = data.pressureWaste ? (data.pressureWaste).toFixed(0) : 0
            reportlist[11].value = data.pressureGapWaste ? (data.pressureGapWaste).toFixed(0) : 0
          }
          that.setData({
            reportlist: reportlist
          })
        }
        wx.hideLoading();
      })
  },

  getTestList2: function (e) {
    const that = this
    let params = {};
    params.projectId = wx.getStorageSync('projectId');
    params.tunnelId = that.data.tunnelId;
    params.deviceId = that.data.deviceId;
    params.startDate = that.data.date + ' 00';
    params.endDate = that.data.date + ' 23';
    wx.showLoading({
      title: '加载中...',
    });
    app.HttpGetSend(
      tunnel_degreeFlow, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let reportlist = that.data.reportlist;
          if(result_data.data.list){
            let data = result_data.data.list[0];
            if (data) {
              reportlist[4].value = data.avgPercent ? (data.avgPercent).toFixed(3) : 0
              reportlist[6].value = data.avgSavingEnergy ? (data.avgSavingEnergy).toFixed(2) : 0
              reportlist[7].value = data.sumSavingEnergy ? (data.sumSavingEnergy).toFixed(2) : 0
            }
          }
          that.setData({
            reportlist: reportlist
          })
        }
        wx.hideLoading();
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.footer = this.selectComponent("#footer");//通过给组件所起的id调用组件
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTestList();
    this.getTestList2();
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
})