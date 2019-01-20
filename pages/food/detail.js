// pages/food/detail.js
const {
  $Toast
} = require('../../components/iview/base/index');
const util = require('../../utils/util.js');
const Food = require('../../service/food');
const Cart = require('../../service/cart');

Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    food: {
      images: [],
      food_name: '',
      description: '',
      price: 0,
      priceS: null,
      specifications: []
    },
    cartShowed: false
  },
  /**
   * 页面启动
   */
  onLoad(query) {
    this.food_id = parseInt(query.food_id);
    this.loadAndShowDetail();
  },

  /**
   * 加载并展示信息
   */
  loadAndShowDetail() {
    const $this = this;
    Food.getDetail(this.food_id)
      .then(function (food) {
        $this.setData({
          food: food
        });
      })
      .catch(function () {

      })
  },
  /**
   * 添加到购物车
   */
  addToCart() {
    const len = this.data.food.specifications.length;
    if (len === 1) {
      // 直接添加到购物车
      const target = this.data.food.specifications[0];
      if (target.count <= 0) return; // 无库存

      Cart.add({
        food_id: this.food_id,
        specification_id: target.id,
        count: 1,
        price: target.price,
        priceS: util.formatPrice(target.price),
        food_name: this.data.food.name,
        specification_name: target.name,
        rest_count: target.count,
        cover: this.data.food.cover
      });
      this.selectComponent("#cart-bar").refresh();

      // 提醒添加到购物车
      $Toast({
        content: '成功添加到购物车',
        type: 'success',
        duration: 1
      });
    } else if (len > 1) {
      // 弹出规格选择器
      this.selectComponent("#cart-specification").show(this.data.food);
    }
  },

  // 隐藏购物车事件
  onCartHide() {
    if (!this.data.cartShowed) return;
    this.setData({
      cartShowed: false
    });
  },
  // 购物车清理事件
  onCartClean() {
    this.setData({
      cartShowed: false
    });
    this.selectComponent("#cart-bar").refresh();
    $Toast({
      content: '清空购物车成功',
      type: 'success',
      duration: 1
    });
  },
  // 购物车更新事件
  onCartUpdate(e) {
    if (e.detail.size) {
      const $list = this.selectComponent("#cart-list");
      if ($list) $list.refresh();
    } else {
      this.setData({
        cartShowed: false
      });
    }

    this.selectComponent("#cart-bar").refresh();
  },
  // 展示购物车
  toggleCart() {
    this.setData({
      cartShowed: !this.data.cartShowed
    });
  }
})