//index.js
import {
  project_list,
} from "../../utils/api.js"

//获取应用实例
const app = getApp()

Page({

  data: {
    carShow: true,  //下拉弹框
    isLogin: true,
    noPhone: true,
    serverCheck: false,
    id: '',
    phone: '',
    code: '',
    setInter: '',
    userInfo: {},
    userCount: '',
    showInfo: {},
    navActive: 0, //活动的标签
    floorNum: '',
    isStart: true,
    tapIndex: -1,
    datalist: ['压缩空气', '电力管理', '用水管理', '水蒸气管理'],
    newsList: [],
    projectlist: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this

    // 项目列表
    app.HttpGetSend(project_list, {}, function (res) {
      if (res.status != 200) {
        app.showTipMsgNone(res.msg);
      } else {
        that.setData({
          projectlist: res.data,
          projectId: res.data[0].id
        })
      }
    });

  },

  goDetail: function (e) {
    let token = wx.getStorageSync('auth-token')
    if(token){
      var title = e.currentTarget.dataset.title;
      var id = e.currentTarget.dataset.id;
      wx.setStorageSync('projectId', id)
      if(this.data.tapIndex == 0){
        wx.navigateTo({
          url: '/pages/infoDetails/infoDetails?title=' + title + '压缩空气',
        })
      }else if(this.data.tapIndex == 1){
        wx.navigateTo({
          url: '/pages/eleAnalysis/eleAnalysis?title=' + title + '电力管理',
        })
      }else if(this.data.tapIndex == 2){
        wx.navigateTo({
          url: '/pages/waterAnalysis/waterAnalysis?title=' + title + '用水管理',
        })
      }else if(this.data.tapIndex == 3){
        wx.navigateTo({
          url: '/pages/vaporAnalysis/vaporAnalysis?title=' + title + '水蒸气管理',
        })
      }
      this.setData({
        carShow: !this.data.carShow
      })
    }else{
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  },

  // 点击压缩空气展示选择
  listTap: function (e) {
    var index = e.currentTarget.dataset.index;
    this.setData({
      carShow: !this.data.carShow
    })
    this.setData({
      tapIndex: index
    })
  },

  changeShow: function (e) {
    this.setData({
      carShow: !this.data.carShow
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onHide: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    
  }

})