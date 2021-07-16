// Componet/Componet.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    model: Array
  },
  /**
   * 组件的初始数据
   */
  data: {
    selectShow: true,
    nowText: "",
    open: true,
    isBranch: true,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectToggle: function () {
      var nowShow = this.data.selectShow;
      this.setData({
        selectShow: !nowShow,
        isBranch: Boolean(this.data.model && this.data.model.length)
      })
    },

    bindKeyInput: function (e) {
      this.setData({
        nowText: e.detail.value
      })
    },

    toggle: function (e) {
      if (this.data.isBranch) {
        this.setData({
          open: !this.data.open,
        })
      }
    },

    tapItem: function (e) {
      var itemid = e.detail.itemid;
      var value = e.detail.value;
      this.triggerEvent('tapitem', { value: value, itemid: itemid }, { bubbles: true, composed: true });
      this.setData({
        selectShow: false,
        nowText: value
      })
    }
  },
})