const util = require('./util');
const app = getApp()

const getMyInfo = function () {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl('/queue'),
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

const getAllStatusInfo = function () {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl('/queue/brief'),
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

const create = function (desk_type_id) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl('/queue'),
      header: {
        'X-Access-Token': app.globalData.token
      },
      method: 'POST',
      data: {
        desk_type_id: desk_type_id
      },
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

const cancel = function (desk_type_id) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl('/queue'),
      header: {
        'X-Access-Token': app.globalData.token
      },
      method: 'DELETE',
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
  getMyInfo, getAllStatusInfo, create, cancel
};
