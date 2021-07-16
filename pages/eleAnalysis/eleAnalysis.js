// pages/eleAnalysis/eleAnalysis.js
import {
  ele_runTimeAnalyse,
  ele_eleAnalyse,
  ele_eleDetail,
  ele_powerAnalyse,
  ele_powerFactorAnalyse,
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
    runTimeList: [{ name: '累计运行时长', value: '', unit: 'h' }, { name: '日最大', value: '', unit: 'h' },
      { name: '日平均', value: '', unit: 'h' }, { name: '日最小', value: '', unit: 'h' },
      { name: '大于日平均的天数', value: '', unit: '天' }, 
      { name: '小于日平均的天数', value: '', unit: '天' }],
    eleAnalyseList: [
      { name: '累计值', value: '', unit: 'kW·h' }, { name: '日最大', value: '', unit: 'kW·h' },
      { name: '日平均', value: '', unit: 'kW·h' }, { name: '日最小', value: '', unit: 'kW·h' },
      { name: '大于日平均的天数', value: '', unit: '天' }, 
      { name: '小于日平均的天数', value: '', unit: '天' }],
    reportlist: [
      { name: '累计值', value: '', unit: 'kW·h' }, { name: '日最大', value: '', unit: 'kW·h' },
      { name: '日平均', value: '', unit: 'kW·h' }, { name: '日最小', value: '', unit: 'kW·h' },
      { name: '大于日平均的天数', value: '', unit: '天' }, 
      { name: '小于日平均的天数', value: '', unit: '天' }],
    powerFactorList: [{ name: '电表数', value: '', unit: '个' },{ name: '取样数', value: '', unit: '个' },
      { name: '最大值', value: '', unit: '' },{ name: '最小值', value: '', unit: '' }],
    powerFactorDetailsList: [],
    eleDetailList: [],
    tabActive: 0,
    tapActive: 1,
    title: '',
    date: '',
    tunnelId: '',
    deviceId: '',
    currentIndex: 0, // 页面swiper的current索引
    index: 0,
    allTotal: 4,
    tablist: ['当天','本周','上周','当月','上月'],
    tabIndex: 0,
    deviceCount: '',
    total_apparent_power_avg: '',
    total_power_avg: '',
    total_idle_power_avg: '',
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
    this.getEleAnalyseList();
    this.getEleDetailList();
    this.getPowerAnalyseList();
    this.getPowerFactorAnalyseList();
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
      ele_runTimeAnalyse, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let reportlist = that.data.runTimeList;
          let data = result_data.data;
          if (data) {
            reportlist[0].value = data.totalRunTime ? util.setHours(data.totalRunTime) : 0
            reportlist[1].value = data.dayMaxValue ? util.setHours(data.dayMaxValue) : 0
            reportlist[2].value = data.dayAvgValue ? util.setHours(data.dayAvgValue) : 0
            reportlist[3].value = data.dayMinValue ? util.setHours(data.dayMinValue) : 0
            reportlist[4].value = data.overAvgCount ? data.overAvgCount : 0
            reportlist[5].value = data.blowAvgCount ? data.blowAvgCount : 0
          }
          that.setData({
            deviceCount: data.deviceCount,
            runTimeList: reportlist
          })
        }
        wx.hideLoading();
      })
  },

  // 电度分析
  getEleAnalyseList: function (e) {
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
      ele_eleAnalyse, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let reportlist = that.data.eleAnalyseList;
          if(result_data.data){
            let data = result_data.data;
            if (data) {
              reportlist[0].value = data.totalAll ? (data.totalAll).toFixed(1) : 0
              reportlist[1].value = data.dayMaxValue ? (data.dayMaxValue).toFixed(1) : 0
              reportlist[2].value = data.dayAvgValue ? (data.dayAvgValue).toFixed(1) : 0
              reportlist[3].value = data.dayMinValue ? (data.dayMinValue).toFixed(1) : 0
              reportlist[4].value = data.overAvgCount ? (data.overAvgCount).toFixed(1) : 0
              reportlist[5].value = data.blowAvgCount ? (data.blowAvgCount).toFixed(1) : 0
            }
          }
          that.setData({
            eleAnalyseList: reportlist
          })
        }
        wx.hideLoading();
      })
  },

  // 分项用电
  getEleDetailList: function (e) {
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
      ele_eleDetail, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let reportlist = that.data.eleDetailList;
          if(result_data.data && result_data.data.list){
            reportlist = result_data.data.list;
            reportlist.map((item)=>{
              item.total = (item.total).toFixed(1)
            })
          }
          that.setData({
            eleDetailList: reportlist
          })
        }
        wx.hideLoading();
      })
  },

  // 功率分析
  getPowerAnalyseList: function (e) {
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
      ele_powerAnalyse, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let data = result_data.data;
          let total_apparent_power_avg = ''
          let total_power_avg = ''
          let total_idle_power_avg = ''
          if (data) {
            total_apparent_power_avg = data.total_apparent_power_avg ? (data.total_apparent_power_avg).toFixed(0) : 0
            total_power_avg = data.total_power_avg ? (data.total_power_avg).toFixed(0) : 0
            total_idle_power_avg = data.total_idle_power_avg ? (data.total_idle_power_avg).toFixed(0) : 0
          }
          that.setData({
            total_apparent_power_avg: total_apparent_power_avg,
            total_power_avg: total_power_avg,
            total_idle_power_avg: total_idle_power_avg,
          })
        }
        wx.hideLoading();
      })
  },

  // 功率因数分析及分布
  getPowerFactorAnalyseList: function (e) {
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
      ele_powerFactorAnalyse, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
      } else {
        let reportlist = that.data.powerFactorList;
        let detail = that.data.powerFactorDetailsList;
        let data = result_data.data;
        if (data) {
          reportlist[0].value = data.deviceCount ? data.deviceCount : 0
          reportlist[1].value = data.curveCount ? data.curveCount : 0
          reportlist[2].value = data.maxValue ? data.maxValue : 0
          reportlist[3].value = data.minValue ? data.minValue : 0
          detail = data.detail.slice(0,5)
          detail.map((item)=>{
            item.curveCountRate = (item.curveCountRate).toFixed(2)
          })
        }
        that.setData({
          powerFactorList: reportlist,
          powerFactorDetailsList: detail
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
    this.getEleAnalyseList();
    this.getEleDetailList();
    this.getPowerAnalyseList();
    this.getPowerFactorAnalyseList();
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