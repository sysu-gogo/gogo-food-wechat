// components/cart/count-picker.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Number,
      value: 1,
      observer(newVal, oldVal, changedPath) {
        if (newVal === oldVal) return;
        this.setData({
          count: newVal
        })
      }
    },
    tag: {
      type: String
    },
    min: {
      type: Number,
      value: 1
    },
    max: {
      type: Number,
      value: Infinity
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    count: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    minusCount() {
      if (this.data.count > this.data.min) {
        this.changeCount(-1)
      }
    },
    plusCount() {
      // 防止超过库存
      if (this.data.count < this.data.max) {
        this.changeCount(1)
      }
    },
    // 改变了计数
    changeCount(dv) {
      const count = this.data.count + dv;
      this.setData({
        count: count
      });
      this.triggerEvent('count-change', {
        count: count,
        dv: dv,
        tag: this.data.tag
      }, {});
    }
  },

  lifetimes: {
    attached() {
      this.setData({
        count: this.data.value
      })
    }
  }
})
