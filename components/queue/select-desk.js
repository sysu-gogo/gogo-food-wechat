// components/queue/select-desk.js
const Queue = require('../../service/queue');
const {
  $Toast
} = require('../../components/iview/base/index');

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    deskTypes: {
      type: Array,
      value: [],
    },
    visible: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showConfirmModel: false,
    selectedDesk: {},
    confirmModelActions: [{
      name: '取消'
    }, {
      name: '确认取号',
      color: '#fc663b'
    }],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideModel() {
      this.setData({
        visible: false,
      })
    },
    askConfirm(e) {
      this.setData({
        showConfirmModel: true,
        selectedDesk: this.data.deskTypes.find(function (v) {
          return v.id === e.target.dataset.id
        })
      })
    },
    doQueue(e) {
      const $this = this;
      this.setData({
        showConfirmModel: false
      });

      switch (e.detail.index) {
        case 0:
          break;
        case 1:
          Queue.create(this.data.selectedDesk.id).then(function () {
            $this.setData({
              visible: false
            });

            // 通知上一层 排队成功
            $this.triggerEvent('queue-success', {}, {});
          })
            .catch(function (e) {
              $Toast({
                content: e.message,
                type: 'warning'
              });
            })
          break;
      }
    }
  }
})
