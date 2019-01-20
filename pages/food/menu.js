// index.js
// 菜单页面
const app = getApp()
const {
  $Toast
} = require('../../components/iview/base/index');
const util = require('../../utils/util.js');
const Category = require('../../service/category');
const Food = require('../../service/food');
const Cart = require('../../service/cart');

Page({
  data: {
    desk: null,
    active_category: 0,
    to_category: 0,
    cartShowed: false,
    category: [],
    food: []
  },
  // 页面初次进入
  onLoad: function () {
    this.loadMenu();
      
  },

  onShow() {
    // 更新桌子信息
    this.setData({
      desk: app.globalData.desk ? app.globalData.desk : null
    })
  },

  /**
   * 跳转到搜索页面
   */
  toSearchPage: function () {
    wx.navigateTo({
      url: 'search',
      error: function () {
        $Toast({
          content: '加载搜索页面失败',
          type: 'warning'
        });
      }
    })
  },

  onScrolltoUpperRefresh() {
    this.loadMenu(true)
  },

  loadMenu(strict) {
    const $this = this;

    // 展示loading界面
    $Toast({
      content: '加载菜单中',
      type: 'loading',
      mask: false,
      duration: 0 // env: 0
    });

    // 判断是否从缓存获取数据
    // 条件：非强制更新 + 缓存未超时
    if (!strict && app.globalData.menu_expired > Date.now()) {
      return display(app.globalData.category, app.globalData.food);
    }

    // 从网络下载数据
    Promise.all([Category.getList(), Food.getList()])
      .then(function (result) {
        app.globalData.category = result[0];
        app.globalData.food = result[1];
        app.globalData.menu_expired = Date.now() + 1000 * 60 * 5; // 五分钟有效

        wx.stopPullDownRefresh();
        display(result[0], result[1]);
      })
      .catch(function (e) {
        console.log(e)
        wx.stopPullDownRefresh();
        $Toast({
          content: '网络异常，请下拉刷新',
          type: 'warning',
        });
      })
    
    function display(category, food) {
      // 分类初始化
      const category_table = {};
      category.forEach(function (v) {
        v.food = [];
        category_table[v.id] = v;
      });

      // 菜品放入分类
      food.forEach(function (f) {
        f.categories.forEach(function (v) {
          category_table[v.id].food.push(f);
        });
      });

      // 分类中的菜品排序
      category.forEach(function (v) {
        v.food.sort(function (a, b) {
          // 排序规则： Order越小 + ID越小  越前
          return a.id - b.id;
        });
      });

      // 更新渲染信息
      $this.setData({
        food: food,
        category: category,
        active_category: category.length ? category[0].id : 0
      });
      
      $Toast.hide();
    }
  },

  // 添加到购物车事件
  onAddToCart(e) {
    const food_id = e.detail.food_id;
    const food = this.data.food.find(function (v) {
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
  // 菜品列表滚动导致分类修改事件
  onCategoryLocByScroll(e) {
    this.setData({
      active_category: e.detail.category_id
    });
  },
  // 菜品列表需要滚动到某个分类事件
  onScrollFoodListToCategory(e) {
    this.setData({
      to_category: e.detail.category_id
    });
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
