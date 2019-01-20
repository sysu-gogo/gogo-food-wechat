const util = require('./util');

const getToken = function (code) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl('/customer/session/wechat'),
      method: 'POST',
      data: {
        code: code
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

module.exports = {
  getToken: getToken
};