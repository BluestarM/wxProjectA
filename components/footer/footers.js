// components/footer/footers.js
var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabActive: {
      type: Number,
      default: 0
    },
    tapActive: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX,

    tablist: [{
      img: '../../images/huizong.png',
      unImg: '../../images/huizong_un.png',
      name: '汇总信息'
    }, {
      img: '../../images/analysis_logo.png',
      unImg: '../../images/analysis.png',
      name: '能耗分析'
    }, {
      img: '../../images/control.png',
      unImg: '../../images/control_un.png',
      name: '控制分析'
    }, {
      img: '../../images/report.png',
      unImg: '../../images/report_un.png',
      name: '设备报告'
    }],
    tabActive: 0,

    tablist2: [{
      img: '../../images/analysis_logo.png',
      unImg: '../../images/analysis.png',
      name: '用电分析'
    }, {
      img: '../../images/report.png',
      unImg: '../../images/report_un.png',
      name: '设备报告'
    }],

    tablist3: [{
      img: '../../images/analysis_logo.png',
      unImg: '../../images/analysis.png',
      name: '用水分析'
    }, {
      img: '../../images/report.png',
      unImg: '../../images/report_un.png',
      name: '设备报告'
    }],

    tablist4: [{
      img: '../../images/analysis_logo.png',
      unImg: '../../images/analysis.png',
      name: '水蒸气分析'
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {

    changeTab: function (e) {
      var index = e.currentTarget.dataset.index;
      let tapIndex = this.data.tapActive;
      if(index==this.data.tabActive){
        return false;
      }
      if(tapIndex == 0){
        if (index == 0) {
          wx.redirectTo({
            url: '/pages/infoDetails/infoDetails?title=' + this.data.title,
          })
        } else if (index == 1) {
          wx.redirectTo({
            url: '/pages/analysis/analysis?title=' + this.data.title,
          })
        } else if (index == 2) {
          wx.redirectTo({
            url: '/pages/controlAnalysis/controlAnalysis?title=' + this.data.title,
          })
        } else {
          wx.redirectTo({
            url: '/pages/deviceReport/deviceReport?title=' + this.data.title,
          })
        }
      }else if(tapIndex == 1){
        if (index == 0) {
          wx.redirectTo({
            url: '/pages/eleAnalysis/eleAnalysis?title=' + this.data.title,
          })
        } else {
          wx.redirectTo({
            url: '/pages/eleDeviceReport/eleDeviceReport?title=' + this.data.title,
          })
        }
      }else if(tapIndex == 2){
        if (index == 0) {
          wx.redirectTo({
            url: '/pages/waterAnalysis/waterAnalysis?title=' + this.data.title,
          })
        } else {
          wx.redirectTo({
            url: '/pages/eleDeviceReport/eleDeviceReport?title=' + this.data.title,
          })
        }
      }

    },
  }
})
