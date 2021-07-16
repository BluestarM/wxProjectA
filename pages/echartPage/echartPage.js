// pages/echartPage/echartPage.js
import * as echarts from '../../ec-canvas/echarts.min';
import {
  controlData_report,
  join_analyzeData
} from "../../utils/api.js"
const util = require('../../utils/util.js');

const app = getApp();
var socketOpen = false;
var pressureData = [];
var upperBenchmark = 0;
var lowerBenchmark = 0;
var minBenchmark = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isChecked: false,
    pressureData: [],
    ec: {
      lazyLoad: true //初始化加载
    },
    flag: true,
    setInter: '',
    date: '',
    controlId: '',
  },

  changeSwitch: function (e) {
    this.setData({
      isChecked: !this.data.isChecked
    })
    this.connection();
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.upperBenchmark) {
      this.setData({
        date: options.date,
        controlId: options.controlId,
      })
      upperBenchmark = options.upperBenchmark;
      lowerBenchmark = options.lowerBenchmark;
      minBenchmark = lowerBenchmark - 0.005;
      this.getPressureData();
    }
  },
  initbt: function () {
    this.echarCanve.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      chart.setOption(this.getOptionbt());
      return chart;
    })
  },
  getOptionbt: function () {
    var option = {
      title: {
        text: '',
        left: 'center'
      },
      legend: {
        data: ['目标数据', '实时数据', '基准上限', '基准下限'],
        // selected: {
        //   '目标数据': false,
        //   '实时数据': false,
        //   '基准上限': false,
        //   '基准下限': false,
        // },
        top: 0,
        right: 'center',
        z: 100
      },
      grid: {
        containLabel: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: pressureData.map(value => util.formatHours(new Date(value.time))),
        // show: false
      },
      yAxis: {
        x: 'center',
        type: 'value',
        min: minBenchmark,
        boundaryGap: [lowerBenchmark, upperBenchmark],
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
        // show: false
      },
      series: [{
        name: '目标数据',
        type: 'line',
        smooth: true,
        data: pressureData.map(value => (value.targetValue).toFixed(3))
      }, {
        name: '实时数据',
        type: 'line',
        smooth: true,
        data: pressureData.map(value => (value.realValue).toFixed(3))
      }, {
        name: '基准上限',
        type: 'line',
        smooth: true,
        data: pressureData.map(value => ((value.upperBenchmark ? value.upperBenchmark : null)).toFixed(3))
      }, {
        name: '基准下限',
        type: 'line',
        smooth: true,
        data: pressureData.map(value => ((value.lowerBenchmark ? value.lowerBenchmark : null)).toFixed(3))
      }],

      dataZoom: [
        {
          type: 'slider',
          show: true,//show属性为false不展示缩放手柄，为true展示缩放手柄
          start: 0,
          end: 45,
          // handleSize: 88  该属性是缩放手柄的宽度
        },
        {
          type: 'inside',
          start: 0,
          end: 45
        }
      ]
    };

    return option;
  },


  getPressureData: function (e) {
    const that = this
    let params = {};
    let projectId = wx.getStorageSync('projectId')
    let obj = {
      "projectId": projectId,
      "controlId": that.data.controlId,
      "startTime": this.data.date,
      "endtTime": this.data.date,
    }
    params.params = [obj];
    params.loadCurve = true;
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
            pressureData = controlData[0].pressureData;
            that.setData({
              pressureData: pressureData
            })

            that.echarCanve = that.selectComponent("#mychart-dom-line");
            that.initbt();
          }
        }
        wx.hideLoading();
      })
  },


  getSocketList: function (e) {
    let that = this;

    wx.connectSocket({
      url: app.globalData.socketUrl + controlData_report + '?auth-token=' + wx.getStorageSync('auth-token'),
    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      socketOpen = true
      that.connection();
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    wx.onSocketMessage(function (resp) {
      let result = JSON.parse(resp.data)
      let controlData = result.controlData

      if (controlData.length > 0) {
        let pressure = result.controlData[0].pressureData
        that.setData({
          pressureData: pressure
        })
        pressureData = pressure
      }
    })
  },

  connection: function (e) {
    let that = this
    console.log('数据发送中')
    let msg = {}
    let sMsg = JSON.stringify(msg);
    if (that.data.isChecked) {
      if (socketOpen) {
        clearInterval(that.data.setInter)
        that.data.setInter = setInterval(() => {
          wx.sendSocketMessage({
            data: sMsg
          })
        }, 2000);
      } else {
        clearInterval(that.data.setInter)
        this.getSocketList()
      }

    } else {
      clearInterval(that.data.setInter)
    }

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
    clearInterval(this.data.setInter)
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