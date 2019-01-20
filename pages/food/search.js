// pages/food/search.js
const Cart = require('../../service/cart');
const util = require('../../utils/util.js');
const {
  $Toast
} = require('../../components/iview/base/index');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    kw: '',
    focus: true,
    mode: '',
    result: [],
    clearShowed: true,
    cartShowed: false
  },

  // 返回上一页
  backPage: function () {
    console.log();
    if (getCurrentPages().length === 1) {
      wx.redirectTo({
        url: 'menu'
      });
    } else {
      wx.navigateBack();
    }
  },

  /**
   * 迷你搜索菜品
   * 根据缓存的菜品列表搜寻
   */
  doMiniSearch: function (ev) {
    const value = ev.detail.value;
    if (!value) {
      return this.setData({
        mode: '',
        clearShowed: false
      });
    }

    return this.setData({
      mode: 'mini',
      result: (app.globalData.food || []).filter(function (food) {
        return food.name.indexOf(value) !== -1;
      }),
      clearShowed: true
    });
  },

  /**
   * 精确搜索
   * 调用API接口搜索菜品
   */
  doSearch: function (ev) {
    const value = ev.detail.value;
    if (!value) {
      return this.setData({
        mode: '',
        clearShowed: false
      });
    }

    return this.setData({
      mode: 'full',
      result: (app.globalData.food || []).filter(function (food) {
        return food.name.indexOf(value) !== -1;
      }),
      clearShowed: true
    });
  },

  fillAndSearch: function (e) {
    const value = e.currentTarget.dataset.name;
    this.setData({
      kw: value,
      focus: false
    });
    this.doSearch({
      detail: {
        value: value
      }
    })
  },

  /**
   * 清空搜索关键词
   */
  clearKeywords: function () {
    this.setData({
      kw: '',
      mode: '',
      clearShowed: false,
      focus: true
    });
  },

  // 添加到购物车事件
  onAddToCart(e) {
    const food_id = e.detail.food_id;
    const food = this.data.result.find(function (v) {
      return v.id === food_id;
    });
    if (!food || food.specifications.length <= 0) return;

    // 只有一个规格就直接加入购物车
    if (food.specifications.length === 1) {
      const target = food.specifications[0];
      if (target.count <= 0) return; // 无库存
      Cart.add({
        food_id: food_id,
        specification_id: target.id,
        count: 1,
        price: target.price,
        priceS: util.formatPrice(target.price),
        food_name: food.name,
        specification_name: target.name,
        rest_count: target.count,
        cover: food.cover
      });

      // 发送消息更新界面
      this.selectComponent("#cart-bar").refresh();

      // 提醒添加到购物车
      $Toast({
        content: '成功添加到购物车',
        type: 'success',
        duration: 1
      });
    } else {
      // 弹出规格选择器
      this.selectComponent("#cart-specification").show(food);
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