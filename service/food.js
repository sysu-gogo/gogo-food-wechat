//
// Food 菜品接口
//
const util = require('./util');
const app = getApp()

const getList = function(strict) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl('/food'),
      header: {
        'X-Access-Token': app.globalData.token
      },
      method: 'GET',
      dataType: 'json',
      success({ data, statusCode }) {
        if (statusCode === 200) {
          // 更新价格的展示文本
          data.forEach(function (f) {
            if (f.specifications.length === 0) {
              f.priceS = '';
              f.available = false;
              return; // 暂无报价
            }

            // 找最低价
            let min_price = Infinity;
            let cnt = 0;
            f.specifications.forEach(v => {
              if (v.price < min_price) min_price = v.price;
              cnt += v.count;
            });
            f.available = !!cnt;

            // 按照最低价计算
            f.priceS = parseInt(min_price / 100)
            if (f.min_price % 100) {
              f.priceS += '.' + min_price % 100;
            }
          });
          resolve(data);
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
};

const getDetail = function(food_id) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: util.getUrl(`/food/${food_id}`),
      header: {
        'X-Access-Token': app.globalData.token
      },
      method: 'GET',
      dataType: 'json',
      success({ data, statusCode }) {
        if (statusCode === 200) {
          // 空的详情
          if (!data) return resolve(null);

          // 更新价格的展示文本
          if (data.specifications.length === 0) {
            data.priceS = '';
            data.available = false;
            return resolve(data); // 暂无报价
          }

          // 找最低价
          let min_price = Infinity;
          let cnt = 0;
          data.specifications.forEach(v => {
            if (v.price < min_price) min_price = v.price;
            cnt += v.count;
          });
          data.available = !!cnt; // 确认存在库存

          // 按照最低价计算
          data.priceS = parseInt(min_price / 100)
          if (min_price % 100) {
            data.priceS += '.' + min_price % 100;
          }

          resolve(data);
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

const getSpecifications = function(food_id) {
  return new Promise(function(resolve, reject) {
    resolve();
  })
}

module.exports = {
  getList: getList,
  getDetail: getDetail,
  getSpecifications: getSpecifications
};