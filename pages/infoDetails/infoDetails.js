// pages/infoDetails/infoDetails.js
import {
  real_data,
  waste_data,
  control_list,
  pressureCurve,
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
    isOpen1: true,
    isOpen2: true,
    isChecked: false,
    reportlist: {},
    wasteData: {},
    tabActive: 0,
    tapActive: 0,
    title: '',
    setInter: '',
    controlName: '',
    controlId: '',
    targetValue: '',
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
    })
    this.getControlList();
  },

  changeOpen: function (e) {
    let dataIndex = e.currentTarget.dataset.index
    if (dataIndex == 1) {
      this.setData({
        isOpen1: !this.data.isOpen1
      })
    } else if (dataIndex == 2) {
      this.setData({
        isOpen2: !this.data.isOpen2
      })
    } else {
      this.setData({
        isOpen: !this.data.isOpen
      })
    }
  },

  changeSwitch: function (e) {
    if (e.detail.value == true) {
      clearInterval(this.data.setInter)
      this.data.setInter = setInterval(() => {
        this.getTestList()
        this.getWasteList()
        this.getPressureCurveList()
      }, 1000);
    } else {
      clearInterval(this.data.setInter)
    }
    this.setData({
      isChecked: !this.data.isChecked
    })
  },

  getTestList: function (e) {
    const that = this
    let params = {};
    params.projectId = wx.getStorageSync('projectId');
    params.startDate = '';
    params.endDate = '';
    // wx.showLoading({
    //   title: '加载中...',
    // });
    app.HttpGetSend(
      real_data, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let data = result_data.data
          if (data) {
            data.power = (data.power).toFixed(2)
            data.realFlow = (data.realFlow).toFixed(2)
            data.degreeFlowPercent = (data.degreeFlowPercent).toFixed(2)
            data.maxPressureDiff = (data.maxPressureDiff).toFixed(2)
            data.standerDqb = (data.standerDqb).toFixed(2)
          }
          that.setData({
            reportlist: data
          })
        }
        // wx.hideLoading();
      })
  },

  getWasteList: function (e) {
    const that = this
    let params = {};
    params.projectId = wx.getStorageSync('projectId');
    params.startDate = '';
    params.endDate = '';
    // wx.showLoading({
    //   title: '加载中...',
    // });
    app.HttpGetSend(
      waste_data, params,
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let data = result_data.data
          if (data) {
            data.allWaste = (data.allWaste).toFixed(2)
            data.unloadWaste = (data.unloadWaste).toFixed(2)
            data.pressureWaste = (data.pressureWaste).toFixed(2)
            data.pressureGapWaste = (data.pressureGapWaste).toFixed(2)
          }
          that.setData({
            wasteData: data
          })
        }
        // wx.hideLoading();
      })
  },

  getControlList: function (e) {
    const that = this
    wx.showLoading({
      title: '加载中...',
    });
    app.HttpGetSend(
      control_list, {},
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          if (result_data.data && result_data.data.length > 0) {
            that.setData({
              controlName: result_data.data[0].joinName,
              controlId: result_data.data[0].id
            })
            that.getPressureCurveList();
          }
        }
        wx.hideLoading();
      })
  },

  getPressureCurveList: function (e) {
    const that = this
    // wx.showLoading({
    //   title: '加载中...',
    // });
    app.HttpGetSend(
      pressureCurve + that.data.controlId + '/pressureCurve', {},
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          let data = result_data.data
          if (data) {
            that.setData({
              targetValue: (data.targetValue).toFixed(2)
            })
          }
        }
        // wx.hideLoading();
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
    this.getTestList();
    this.getWasteList();
    if (this.data.controlId) {
      this.getPressureCurveList();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.setInter)
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