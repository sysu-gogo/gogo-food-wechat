// components/tabbar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    current: {
      type: 'string'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange({ detail }) {
      if (detail.key === this.data.current) return;

      switch (detail.key) {
        case 'home':
          wx.redirectTo({
            url: '/pages/index/index'
          })
          break;
        case 'queue':
          wx.redirectTo({
            url: '/pages/queue/index'
          })
          break;
        case 'order':
          wx.redirectTo({
            url: '/pages/order/index'
          })
          break;
      }
    }
  }
})
