//
// Cart 购物车接口
//
const util = require('./util');
const app = getApp()

/*
结构体：
{
  food_id
  specification_id
  count
  price 单位价格
  priceS 单位价格（可读字符串）
  food_name 菜品名称
  specification_name 规格名称
  rest_count 剩余库存
}

*/

const initCart = function () {
  const cart = {
    items: [],
    total_price: 0,
    last_updated_at: Date.now()
  };
  wx.setStorageSync('cart', cart);
  return cart;
};

const getCart = function () {
  const cart = wx.getStorageSync('cart')
  return cart ? cart : initCart();
}

const addItem = function (params) {
  const cart = getCart();

  var found = false;
  cart.items.forEach(function (v, i) {
    // 以前存在过
    if (v.specification_id === params.specification_id) {
      // 在原来的基础上加
      var new_count = v.count + params.count;

      // 超过库存
      if (new_count > v.rest_count) new_count = v.rest_count;

      cart.total_price += (new_count - v.count) * params.price;
      v.count = new_count;

      found = true;
    }
  });

  if (!found) {
    // 超过库存
    if (params.count > params.rest_count) params.count = params.rest_count;

    cart.items.push(params);
    cart.total_price += params.count * params.price; // 计算账目
  }
  wx.setStorageSync('cart', cart);
  return cart.items.length;
}

// 更新购物车购买个数
const updateItem = function (specification_id, cnt) {
  const cart = getCart();

  const length = cart.items.length;
  for (var i = 0; i < length; i++) {
    // 找到菜品
    if (cart.items[i].specification_id === specification_id) {
      var target = cart.items[i].count + cnt; // 目标count

      // 超过库存检测
      if (target > cart.items[i].rest_count) {
        cart.total_price += (cart.items[i].rest_count - cart.items[i].count) * cart.items[i].price;
        cart.items[i].count = cart.items[i].rest_count;
      } else {
        cart.items[i].count = target;
        cart.total_price += cnt * cart.items[i].price;
      }

      if (cart.items[i].count <= 0) { // 没了就要删除
        cart.items.splice(i, 1);
      }
      break;
    }
  }
  wx.setStorageSync('cart', cart);
  return cart.items.length;
}

const removeItem = function (specification_id) {
  const cart = getCart();
  const length = cart.items.length;
  for (var i = 0; i < length; i++) {
    if (cart.items[i].specification_id === specification_id) {
      cart.total_price -= cart.items[i].count * cart.items[i].price;
      cart.items.splice(i, 1);
      break;
    }
  }

  wx.setStorageSync('cart', cart);
  return cart.items.length;
}

const submit = function (remark) {
  const cart = getCart();

  return new Promise(function (resolve, reject) {
    if (cart.items.length <= 0) {
      return reject(new Error('购物车为空'))
    } else if (!app.globalData.desk) {
      return reject(new Error('请先扫描桌子上的二维码就座'))
    } 
    const desk_id = app.globalData.desk.id;

    wx.request({
      url: util.getUrl('/order'),
      method: 'POST',
      data: {
        remark: remark,
        cart: cart.items.map(function (v) {
          return [v.specification_id, v.count].join(',')
        }).join('|'),
        desk_id: desk_id
      },
      header: {
        'X-Access-Token': app.globalData.token
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
  init: initCart,
  get: getCart,
  add: addItem,
  update: updateItem,
  remove: removeItem,
  reset: initCart,
  submit: submit
}