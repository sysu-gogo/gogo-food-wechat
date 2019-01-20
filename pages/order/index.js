// pages/order/index.js
const app = getApp();
const Config = require('../../config.js');
const Order = require('../../service/order');
const util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.displayList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.displayList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  displayList() {
    const $this = this;
    Order.getList()
      .then(function (res) {
        res.forEach(function (v) {
          v.created_atS = util.formatDate(new Date(v.created_at));
          v.total_priceS = util.formatPrice(v.total_price);
        });
        wx.stopPullDownRefresh();
        $this.setData({
          orders: res
        })
      })
      .catch(function (e) {
        wx.stopPullDownRefresh();
      })
  },

  toDetailPage(e) {
    wx.navigateTo({
      url: `./detail?order_id=${e.currentTarget.dataset.id}`,
    })
  }
})