// pages/vaporAnalysis/vaporAnalysis.js
import {
  vapor_vaporAnalyse,
  vapor_vaporDayData,
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
    runTimeList: [{ name: '累计值', value: '', unit: '(m³)' }, { name: '日最大', value: '', unit: '(m³)' },
      { name: '日平均', value: '', unit: '(m³)' }, { name: '日最小', value: '', unit: '(m³)' },
      { name: '大于日平均的天数', value: '', unit: '(天)' }, 
      { name: '小于日平均的天数', value: '', unit: '(天)' }],
    vaporDayDataList: [],
    tabActive: 0,
    tapActive: 3,
    title: '',
    date: '',
    tunnelId: '',
    deviceId: '',
    currentIndex: 0, // 页面swiper的current索引
    index: 0,
    allTotal: 2,
    tablist: ['当天','本周','上周','当月','上月'],
    tabIndex: 0,
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

  changeTab: function (e) {
    let index = e.currentTarget.dataset.index
    let date = '';
    if(index == this.data.tabIndex ){
      return;
    }
    if(index==0){
      date = util.formatDate(new Date())
    }else if(index==1){
      date = util.getWeekStartDate() + ' 至 ' + util.getWeekEndDate()
    }else if(index==2){
      date = util.getLastWeekStartDate() + ' 至 ' + util.getLastWeekEndDate()
    }else if(index==3){
      date = util.getMonthStartDate() + ' 至 ' + util.getMonthEndDate()
    }else if(index==4){
      date = util.getLastMonthStartDate() + ' 至 ' + util.getLastMonthEndDate()
    }
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      date: date
    })
    this.getRunTimeList();
    this.getVaporDayDataList();
  },

  changeIndex: function (e) { // 切换过程绑定
    this.setData({
      index: e.detail.current
    })
  },

  // 运行时长分析
  getRunTimeList: function (e) {
    const that = this
    let params = {};
    params.projectId = wx.getStorageSync('projectId');
    let date = that.data.date;
    if(date.indexOf('至')>-1){
      params.startDate = date.split('至')[0].trim()
      params.endDate = date.split('至')[1].trim()
    }else{
      params.startDate = date;
      params.endDate = date;
    }
    wx.showLoading({
      title: '加载中...',
    });
    app.HttpGetSend(
      vapor_vaporAnalyse, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let reportlist = that.data.runTimeList;
          let data = result_data.data;
          if (data) {
            reportlist[0].value = data.totalAll ? (data.totalAll).toFixed(1) : 0
            reportlist[1].value = data.dayMaxValue ? (data.dayMaxValue).toFixed(1) : 0
            reportlist[2].value = data.dayAvgValue ? (data.dayAvgValue).toFixed(1) : 0
            reportlist[3].value = data.dayMinValue ? (data.dayMinValue).toFixed(1) : 0
            reportlist[4].value = data.overAvgCount ? data.overAvgCount : 0
            reportlist[5].value = data.blowAvgCount ? data.blowAvgCount : 0
          }
          that.setData({
            runTimeList: reportlist
          })
        }
        wx.hideLoading();
      })
  },

  // 抄录
  getVaporDayDataList: function (e) {
    const that = this
    let params = {};
    params.projectId = wx.getStorageSync('projectId');
    let date = that.data.date;
    if(date.indexOf('至')>-1){
      params.startDate = date.split('至')[0].trim()
      params.date = date.split('至')[1].trim()
    }else{
      params.startDate = date;
      params.date = date;
    }
    wx.showLoading({
      title: '加载中...',
    });
    app.HttpGetSend(
      vapor_vaporDayData, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let reportlist = that.data.vaporDayDataList;
          if(result_data.data){
            reportlist = result_data.data;
            reportlist.map((item)=>{
              item.readValue = item.readValue ? item.readValue : 0
              item.total = (item.total).toFixed(1)
            })
          }
          that.setData({
            vaporDayDataList: reportlist
          })
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
    this.getRunTimeList();
    this.getVaporDayDataList();
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