// components/cart/specification.js
const util = require('../../utils/util.js');
const Cart = require('../../service/cart');

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
    food: {},
    chosen: {},
    count: 1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hide() {
      this.setData({
        show: false
      });
    },
    show(food) {
      food.specifications.forEach(function (v) {
        v.priceS = util.formatPrice(v.price);
      })
      this.setData({
        food: food,
        count: 1,
        chosen: food.specifications[0], // 默认选中第一个
        show: true
      });
    },
    minusCount() {
      if (this.data.count > 1) {
        this.setData({
          count: this.data.count - 1
        })
      }
    },
    plusCount() {
      // 防止超过库存
      if (this.data.count < this.data.chosen.count) {
        this.setData({
          count: this.data.count + 1
        })
      }
    },
    // 选择一个规格
    choose(e) {
      const specification = this.data.food.specifications.find(function (v) {
        return e.currentTarget.dataset.specification_id === v.id;
      });
      if (specification) {
        this.setData({
          // 防止过量销售
          count: this.data.count <= specification.count ? this.data.count : specification.count,
          chosen: specification
        })
      }
    },
    // 添加到购物车
    addToCart() {
      const size = Cart.add({
        food_id: this.data.food.id,
        specification_id: this.data.chosen.id,
        count: this.data.count,
        price: this.data.chosen.price,
        priceS: util.formatPrice(this.data.chosen.price),
        food_name: this.data.food.name,
        specification_name: this.data.chosen.name,
        rest_count: this.data.chosen.count,
        cover: this.data.food.cover
      });
      
      this.triggerEvent('cart-update', {
        size: size
      }, {});

      this.setData({
        show: false
      });
    },
    // 订购数目改变
    onCountChange(e) {
      this.setData({
        count: e.detail.count
      })
    }
  }
})
