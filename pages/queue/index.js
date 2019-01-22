// pages/queue/index.js
const app = getApp();
const Config = require('../../config.js');
const Queue = require('../../service/queue');
const util = require('../../utils/util.js');
const {
  $Toast
} = require('../../components/iview/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    needQueue: true,
    deskTypes: [],
    myStatus: {},

    showCancelModel: false,
    cancelModelActions: [{
      name: '继续排队'
    }, {
      name: '取消排队',
      color: '#fc663b'
    }],

    showSelectDesk: false,
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
    this.loadQueueInfo();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadQueueInfo();
  },

  loadQueueInfo() {
    const $this = this;

    Queue.getAllStatusInfo().then(function (res) {
      if (res.every(function (v) {
        return v.count === 0
      })) {
        return $this.setData({
          needQueue: false
        })
      }

      return $this.setData({
        needQueue: true,
        deskTypes: res
      })
    });

    Queue.getMyInfo().then(function (res) {
      return $this.setData({
        myStatus: res
      })
    })
  },

  askPickQueue() {
    this.setData({
      showSelectDesk: true
    })
  },

  askCancel() {
    this.setData({
      showCancelModel: true
    })
  },

  doCancel(e) {
    const $this = this;
    this.setData({
      showCancelModel: false
    });

    switch (e.detail.index) {
      case 0:
        break;
      case 1:
        Queue.cancel().then(function () {
          $this.loadQueueInfo();
          $Toast({
            content: '取消排队成功',
            type: 'success'
          });
        })
        .catch(function(e) {
          $Toast({
            content: e.message,
            type: 'warning'
          });
        })
        break;
    }
  },

  onQueueSuccess() {
    this.loadQueueInfo();
    $Toast({
      content: '取号成功',
      type: 'success'
    });
  }
})