const util = require('./util');
const app = getApp()

const getList = function () {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl('/order'),
      header: {
        'X-Access-Token': app.globalData.token
      },
      method: 'GET',
      dataType: 'json',
      success({ data, statusCode }) {
        if (statusCode === 200) {
          resolve(data)
        } else if (statusCode === 500) {
          reject(new Error(data.message || '未知错误'))
        } else {
          reject(new Error('网络通讯错误'))
        }
      },
      fail(e) {
        reject(new Error('网络通讯错误'))
      },
    })
  })
}


const getDetail = function (order_id) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl(`/order/${order_id}`),
      header: {
        'X-Access-Token': app.globalData.token
      },
      method: 'GET',
      dataType: 'json',
      success({ data, statusCode }) {
        if (statusCode === 200) {
          resolve(data)
        } else if (statusCode === 500) {
          reject(new Error(data.message || '未知错误'))
        } else {
          reject(new Error('网络通讯错误'))
        }
      },
      fail(e) {
        reject(new Error('网络通讯错误'))
      },
    })
  })
}

const getStatus = function (order_id) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl(`/order/${order_id}/status`),
      header: {
        'X-Access-Token': app.globalData.token
      },
      method: 'GET',
      dataType: 'json',
      success({ data, statusCode }) {
        if (statusCode === 200) {
          resolve(data)
        } else if (statusCode === 500) {
          reject(new Error(data.message || '未知错误'))
        } else {
          reject(new Error('网络通讯错误'))
        }
      },
      fail(e) {
        reject(new Error('网络通讯错误'))
      },
    })
  })
}

module.exports = {
  getList, getDetail, getStatus
};