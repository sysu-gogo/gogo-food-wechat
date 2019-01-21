// pages/index/index.js
const app = getApp();
const Config = require('../../config.js');
const Auth = require('../../service/auth.js');
const Desk = require('../../service/desk');
const {
  $Toast
} = require('../../components/iview/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMask: false
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
    // 检测登录
    if (!app.globalData.token) {
      this.doWxLogin();
    }
  },

  doWxLogin() {
    this.setData({
      showMask: true
    });

    $Toast({
      content: '正在登录..',
      type: 'loading',
      duration: 0,
      mask: false
    });

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.doGetToken(res.code);
      }
    });
  },

  doGetToken(code) {
    const $this = this;
    Auth.getToken(code).then(function (res) {
      app.globalData.token = res.token;

      $this.setData({
        showMask: false
      });
      $Toast.hide();
    }).catch(function (e) {
      $this.setData({
        errmsg: e.message
      });

      $Toast.hide();
    })
  },

  retryLogin() {
    this.setData({
      errmsg: ''
    });
    this.doWxLogin();
  },

  // 到订单页面
  toOrderPage() {
    wx.redirectTo({
      url: '/pages/order/index'
    })
  },

  // 到排队页面
  toQueuePage() {
    wx.redirectTo({
      url: '/pages/queue/index'
    })
  },

  // 扫描二维码就座
  scanQRCode() {
    const $this = this;
    if ($this.data.desk) return;

    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success(res) {
        // 匹配规则
        const t = /\/wechat\/qrcode\/desk\/([\d]+)/.exec(res.result || '');
        if (!t) {
          return $Toast({
            content: '请扫描桌上的二维码',
            type: 'warning'
          });
        }


        const desk_id = parseInt(t[1]); // 桌面ID
        Desk.getInfo(desk_id)
          .then(function (desk) {
            app.globalData.desk = desk;

            $this.setData({
              desk: desk
            });

            wx.navigateTo({
              url: '/pages/food/menu'
            })
          })
          .catch(function (e) {
            $Toast({
              content: e.message,
              type: 'warning'
            });
          })

      },
      fail(e) {
        $Toast({
          content: '请扫描桌上的二维码',
          type: 'warning'
        });
      }
    })
  },

  viewMenu() {
    app.globalData.desk_id = null; // 清空桌面信息
    wx.navigateTo({
      url: '/pages/food/menu'
    })
  }
})