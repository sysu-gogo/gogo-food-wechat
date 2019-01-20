// components/cart/list.js
const Cart = require('../../service/cart')

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
    showCleanModel: false,
    cleanModelActions: [{
      name: '取消'
    }, {
      name: '确认清空',
      color: '#fc663b'
    }],
    value: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    askClean() {
      this.setData({
        showCleanModel: true
      })
    },
    doClean(e) {
      switch (e.detail.index) {
        case 0:
          this.setData({
            showCleanModel: false
          });
          break;
        case 1:
          Cart.reset();

          this.triggerEvent('cart-clean', {}, {});
          break;
      }
    },
    //
    onCountChange(e) {
      const size = Cart.update(parseInt(e.detail.tag), e.detail.dv);
      this.triggerEvent('cart-update', {
        size: size
      }, {});
    },
    /**
     * 隐藏购物车列表
     */
    hideCart() {
      this.triggerEvent('cart-hide', {}, {})
    },
    // 获取本地购物车
    refresh() {
      this.setData({
        value: Cart.get()
      });
    }
  },
  lifetimes: {
    ready() {
      this.refresh()
    },
  },
  pageLifetimes: {
    show() {
      this.refresh()
    },
  }
})
