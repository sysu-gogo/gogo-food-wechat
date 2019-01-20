// components/cart/modal/select-customer-count.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    choices: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this.setData({
        show: true
      })
    },
    hide() {
      this.setData({
        show: false
      })
    },
    choose(e) {
      this.triggerEvent('customer-count-update', {
        count: e.currentTarget.dataset.count
      }, {});
      this.hide();
    }
  },

  lifetimes: {
    attached() {
      for(var i = 1; i <= 12; i++) {
        this.data.choices.push(i)
      }
      this.setData({
        choices: this.data.choices
      })
    }
  }
})
