// components/food/menu-list-item.js
const util = require('../../utils/util.js');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
      observer(newVal, oldVal, changedPath) {
        if (!newVal.priceS) {
          newVal.priceS = util.formatPrice(newVal)
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 添加到购物车
     */
    addToCart(event) {
      if (!this.data.item.available) return;

      this.triggerEvent('addToCart', {
        food_id: this.data.item.id
      }, {
          bubbles: true, composed: true
      })
    },
    /**
     * 跳转到菜品详情
     */
    toDetailPage() {
      wx.navigateTo({
        url: './detail?food_id=' + this.data.item.id
      })
    }
  },
})
