// components/cart/submit-order-bar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    total_priceS: {
      type: String
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
    confirm() {
      this.triggerEvent('confirm', {}, {});
    }
  }
})
