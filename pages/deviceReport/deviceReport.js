// pages/deviceReport/deviceReport.js
import {
  device_tree,
  device_report,
} from "../../utils/api.js"
const util = require('../../utils/util.js');

var app = getApp();
var socketOpen = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,
    isOpen1: true,
    isOpen2: true,
    isChecked: false,
    colorlist: ['#000000','#00ec00','#ffff00','#3fdbf7','#ffa500','#ff0000','#395dce','#00ec00'],
    colorValue: '',
    stateList: [],
    eleList: [],
    mainList: [],
    description: '',
    realValue: '',
    tabActive: 3,
    title: '',
    date: '',
    deviceId: '',
    deviceName: '',
    detailList: [{}],
    currentIndex: 0, // 页面swiper的current索引
    index: 0,
    allTotal: 3,
    flag: true,
    setInter: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.setNavigationBarTitle({
      title: options.title,
    })
    this.setData({
      title: options.title,
      date: util.formatDate(new Date())
    })
    
    app.HttpGetSend(
      device_tree, {},
      function (result_data) {
        if (result_data.status != 200) {
          app.showTipMsgNone(result_data.msg);
        } else {
          if(result_data.otherData){
            let firstDid = ''
            let firstDName = ''
            if(result_data.otherData.firstDid){
              firstDid = result_data.otherData.firstDid.replace('_did','')
              firstDName = result_data.otherData.firstDName
            }
            that.setData({
              deviceName: firstDName,
              deviceId: firstDid,
            })
            that.getTestList();   
          }
        }
      })
     
  },

  changeOpen: function (e) {
    let dataIndex = e.currentTarget.dataset.index
    if(dataIndex==1){
      this.setData({
        isOpen1: !this.data.isOpen1
      })
    }else{
      this.setData({
        isOpen2: !this.data.isOpen2
      })
    }
  },

  changeSwitch: function (e) {
    this.setData({
      isChecked: !this.data.isChecked
    })
    this.connection();
  },

  searchTap: function (e) {
    wx.navigateTo({
      url: '/pages/searchPage/searchPage',
    })
  },

  prevImg: function () {
    if (!this.data.flag) { // 如果动画还未完成，不执行
      return
    } else {
      // 修改按钮切换不可用状态
      this.setData({
        flag: false
      })
      var index = this.data.index;
      var detaillist = this.data.detailList;
      if (index > 0) {
        this.setData({
          currentIndex: index - 1
        })
      } else {
        this.setData({
          currentIndex: this.data.detailList.length - 1
        })
      }
    }
  },

  nextImg: function () {
    if (!this.data.flag) { // 如果动画还未完成，不执行
      return
    } else {
      // 修改按钮切换不可用状态
      this.setData({
        flag: false
      })
      var index = this.data.index;
      var detaillist = this.data.detailList;
      if (index >= this.data.detailList.length - 1) {
        this.setData({
          currentIndex: 0,
        })
      } else {
        this.setData({
          currentIndex: index + 1
        })
      }
    }
  },

  changeIndex: function (e) { // 切换过程绑定
    let index = e.detail.current;
    var detaillist = this.data.detailList;
    this.setData({
      index: e.detail.current
    })
  },
  changeFinish: function (e) { // 动画完全完成
    // 修改按钮切换可用状态
    this.setData({
      flag: true
    })
  },

  getTestList: function (e) {
    let that = this;

    wx.connectSocket({
      url: app.globalData.socketUrl+device_report+'?auth-token='+wx.getStorageSync('auth-token'),
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
      let stateList = result.stateList
      let eleList = result.eleList
      let mainList = result.mainList
      for(let i=0;i<mainList.length;i++){
        if(mainList[i].realValue != null){
          if(mainList[i].description=='压力'){
            mainList[i].realValue = (mainList[i].realValue).toFixed(3);
          }else if(mainList[i].attrName=='flow'){
            mainList[i].realValue = (mainList[i].realValue).toFixed(0);
          }else{
            mainList[i].realValue = (mainList[i].realValue).toFixed(1);
          }
        }else{
          mainList[i].realValue = '--';
        }
      }
      for(let i=0;i<eleList.length;i++){
        if(eleList[i].realValue != null){
          if(eleList[i].attrName.indexOf('powerFactor') > -1){
            eleList[i].realValue = (eleList[i].realValue).toFixed(2);
          }else if(eleList[i].attrName == 'degree' || eleList[i].attrName == 'idleDegree'
           || eleList[i].attrName == 'CT' || eleList[i].attrName == 'PT'){
            eleList[i].realValue = (eleList[i].realValue).toFixed(0);
          }else{
            eleList[i].realValue = (eleList[i].realValue).toFixed(1);
          }
        }else{
          eleList[i].realValue = '--';
        }
      }
      that.setData({
        stateList: stateList,
        eleList: eleList,
        mainList: mainList,
      })

      if(stateList.length>0){
        that.setData({
          realValue: stateList[0].realValue,
          colorValue: that.data.colorlist[stateList[0].realValue],
          description: stateList[0].description
        })  
      }
    })
  },

  connection: function(e){
    let that = this
    console.log('数据发送中')
    let msg = {
      deviceId: that.data.deviceId
    }
    let sMsg = JSON.stringify(msg);
    if(that.data.isChecked){
      if(socketOpen){
        clearInterval(that.data.setInter)
        that.data.setInter = setInterval(() => {
          wx.sendSocketMessage({
            data: sMsg
          })
        }, 1000);
      }else{
        clearInterval(that.data.setInter)
      }
      
    }else{
      clearInterval(that.data.setInter)
      if(socketOpen){
        wx.sendSocketMessage({
          data: sMsg
        })
      }else{
        clearInterval(that.data.setInter)
      }
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
    // this.getTestList();    
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
})