// pages/order/status.js
const app = getApp();
const Config = require('../../config.js');
const Order = require('../../service/order');
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    restaurant_name: Config.restaurant_name
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.order_id = options.order_id;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.displayDetail()
  },

  // 展示详细信息
  displayDetail() {
    const $this = this;
    Order.getDetail(this.order_id)
    .then(function (res) {
      res.items.forEach(function (v) {
        v.priceS = util.formatPrice(v.price);
      });

      res.total_priceS = util.formatPrice(res.total_price);
      res.paid_priceS = util.formatPrice(res.paid_price);
      res.created_atS = util.formatTime(new Date(res.created_at));
      if (res.finish_at) {
        res.finish_atS = util.formatTime(new Date(res.finish_at));
      } else {
        res.finish_atS = '';
      }

      $this.setData({
        order: res
      });

      if ($this.data.status !== 'finish' && $this.data.status !== 'canceled') {
        $this.listener = setInterval($this.refreshStatus, 500);
      }
    })
  },

  // 更新订单状态
  refreshStatus() {
    const $this = this;

    // 已经结束的状态就不刷新了
    if (this.data.status === 'finish' || this.data.status === 'canceled') {
      clearInterval(this.listener);
      return;
    }

    Order.getStatus(this.order_id)
      .then(function (res) {
        if (res.status === 'finish' || res.status === 'canceled') {
          clearInterval($this.listener);
        }

        if (res.status !== $this.data.order.status) {
          $this.displayDetail();
        }
      })
  }
})
