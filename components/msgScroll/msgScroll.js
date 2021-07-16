// components/msgScroll/msgScroll.js
var interval;
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isHiddenMsg: false,
    announcementText: "添加到我的小程序，了解实时能耗详情！",
    //滚动速度
    step: 1,
    //初始滚动距离
    distance: 10,
    space: 30,
    // 时间间隔
    interval: 20,
  },
  attached() {
    // 第二种方式通过组件的生命周期函数执行代码
    this.topScroll();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 关闭顶部通知 */
    closeMsg() {
      this.setData({ isHiddenMsg: true });
      clearInterval(interval);
    },

    /** 获取滚动条基本信息 */
    topScroll() {
      var that = this;
      var query = wx.createSelectorQuery();
      //选择id
      query.select('#mjltest').boundingClientRect()
      query.exec(function (res) {
        var length = that.data.announcementText.length * 14;
        var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度

        that.setData({
          length: length,
          windowWidth: windowWidth,
          space: windowWidth
        });
        that.scrollling(); // 第一个字消失后立即从右边出现
      });
    },
    /** 向左滚动 */
    scrollling: function () {
      var that = this;
      var length = that.data.length; //滚动文字的宽度
      let interval = setInterval(function () {
        var maxscrollwidth = length + that.data.space;
        var left = that.data.distance;
        if (left < maxscrollwidth) { //判断是否滚动到最大宽度
          that.setData({
            distance: left + that.data.step
          })
        } else {
          that.setData({
            distance: 10 // 直接重新滚动
          });
          clearInterval(interval);
          that.scrollling();
        }
      }, that.data.interval);
    },
  }
})
