// components/cart/bar.js
const Cart = require('../../service/cart')
const util = require('../../utils/util');

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
    items: [],
    total_price: 0,
    total_priceS: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 显示购物车列表
    showCartList() {
      this.triggerEvent('cart-toggle', {}, {})
    },
    // 刷新信息
    refresh() {
      const cart = Cart.get();
      cart.priceS = util.formatPrice(cart.total_price);
      this.setData(cart); 
    },
    // 跳转到下单页面
    toCartPage() {
      wx.navigateTo({
        url: './cart'
      })
    }
  },

  lifetimes: {
    ready() { // 绑定的时候自动更新
      this.refresh()
    },
  },
  pageLifetimes: {
    show() {
      this.refresh()
    },
  }
})
