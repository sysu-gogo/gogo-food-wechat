// pages/food/cart.js
const app = getApp();
const Config = require('../../config.js');
const {
  $Toast
} = require('../../components/iview/base/index');
const util = require('../../utils/util.js');
const Cart = require('../../service/cart');
const Desk = require('../../service/desk');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    desk: null,
    restaurant_name: Config.restaurant_name,
    customer_count: 0,
    cart: {},
    remark: '',
    available: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 加载桌面信息
    const desk = app.globalData.desk;

    // 加载购物车信息
    const cart = Cart.get();
    var total_price = 0;
    cart.items.forEach(function(v) {
      v.total_price = v.count * v.price;
      v.total_priceS = util.formatPrice(v.total_price);
      total_price += v.total_price;
    });

    cart.total_price = total_price;
    cart.total_priceS = util.formatPrice(total_price);

    this.setData({
      cart: cart,
      customer_count: app.globalData.customer_count || 0,
      desk: desk
    })
  },

  /**
   * 选择就餐人数
   */
  selectCustomerCount() {
    this.selectComponent("#select-customer-count").show();
  },

  /**
   * 扫描桌号二维码
   */
  scanDeskQRCode() {
    const $this = this;
    if ($this.data.desk) return;

    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success(res) {
        const t = /\/wechat\/qrcode\/desk\/([\d]+)/.exec(res.result || '');
        if (!t) {
          return $Toast({
            content: '请扫描正确的二维码',
            type: 'warning'
          });
        }

        const desk_id = parseInt(t[1]);
        Desk.getInfo(desk_id)
        .then(function(desk) {
          app.globalData.desk = desk;

          $this.setData({
            desk: desk
          });

          $Toast({
            content: '就座成功',
            type: 'success'
          });
        })
        .catch(function(e) {
          $Toast({
            content: e.message,
            type: 'warning'
          });
        })

      },
      fail(e) {
        $Toast({
          content: '就座失败',
          type: 'warning'
        });
      }
    })
  },

  onCustomerCountUpdate(e) {
    app.globalData.customer_count = e.detail.count; // 记录一下当前次的就餐人数
    this.setData({
      customer_count: e.detail.count
    })
  },
  onChangeRemark(e) {
    this.setData({
      remark: e.detail.detail.value
    })
  },

  /**
   * 开始下单
   */
  confirm() {
    if (!this.data.available) {
      return;
    } else if (!this.data.desk) {
      return $Toast({
        content: '您未扫码就座',
        type: 'warning'
      });
    } else if (!this.data.customer_count) {
      return $Toast({
        content: '您未选择就餐人数',
        type: 'warning'
      });
    }

    this.setData({
      available: false
    })

    // 1. 申请下单
    $Toast({
      content: '正在下单',
      type: 'loading',
      mask: false,
      duration: 0,
    });

    Cart.submit(this.data.remark)
    .then(function(res) {
      const order_id = res.order_id;
      Cart.reset(); // 清空购物车

      // 2. 获取支付信息
      // 模拟就不提供了

      // 3. 发起支付

      $Toast({
        content: '正在支付',
        type: 'loading',
        mask: false,
        duration: 0,
      });



      // 4. 跳转到支付完成页面
      setTimeout(function () {
        $Toast.hide();
        $Toast({
          content: '支付成功',
          mask: false,
          type: 'success'
        });

        setTimeout(function () {
          wx.redirectTo({
            url: `/pages/order/detail?order_id=${order_id}`,
          })
        }, 2000);

      }, 1500);
    }).catch(function(e) {
      $Toast.hide();
      $Toast({
        content: e.message,
        mask: false,
        type: 'warning'
      });
    })
    
  }
})