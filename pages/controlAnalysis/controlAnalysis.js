// pages/controlAnalysis/controlAnalysis.js
import {
  control_list,
  join_analyzeData
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
    reportlist: [],
    tabActive: 2,
    title: '',
    date: '',
    controlId: '',
    joinEquipState: [],
    pressureData: [],
    joinEquipState: [],
    pressureList: [],
    realValue: '',  //联控压力
    targetValue: '',  //目标压力
    upperBenchmark: '',  //基准上限
    lowerBenchmark: '',  //基准下限
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
    
    this.getControlList();
  },

  // 下拉选择日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
    this.getTestList();
  },

  // 单击查看曲线表
  goCharts: function (e) {
    wx.navigateTo({
      url: '/pages/echartPage/echartPage?controlId='+this.data.controlId+'&date='+this.data.date+'&upperBenchmark='+this.data.upperBenchmark+'&lowerBenchmark='+this.data.lowerBenchmark,
    })
  },

  getControlList: function(e){

    let that = this
    app.HttpGetSend(
      control_list, {},
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          if (result_data.data && result_data.data.length > 0) {
            that.setData({
              controlId: result_data.data[0].id
            })
            that.getTestList();
          }
        }
      })
  },

  getTestList: function (e) {
    const that = this
    let params = {};
    let projectId = wx.getStorageSync('projectId')
    let obj = {
      "projectId": projectId, 
      "controlId": that.data.controlId,
      "startTime": this.data.date,
      "endtTime": this.data.date,
      "offset": 1,
      "segment": 1
    }
    params.params = [obj];
    params.loadCurve = false;
    wx.showLoading({
      title: '加载中...',
    });
    app.HttpGetSend(
      join_analyzeData, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          if (result_data.data && result_data.data.controlData.length > 0) {
            let controlData = result_data.data.controlData
            that.setData({
              joinEquipState: controlData[0].joinEquipState,
              pressureData: controlData[0].pressureData,
            })
            let pressureData = controlData[0].pressureData
            if (pressureData.length > 0) {
              that.setData({
                realValue: (pressureData[0].realValue).toFixed(3),
                targetValue: (pressureData[0].targetValue).toFixed(3),
                upperBenchmark: (pressureData[0].upperBenchmark).toFixed(3),
                lowerBenchmark: (pressureData[0].lowerBenchmark).toFixed(3),
              })
            }
          }
        }
        wx.hideLoading();
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
    if(this.data.controlId){
      this.getTestList();
    }
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