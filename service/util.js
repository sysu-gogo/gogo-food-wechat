const Config = require('../config.js');

exports.getUrl = function (uri) {
  let url = [];
  url.push(Config.server[Config.mode].schema);
  url.push('://');
  url.push(Config.server[Config.mode].server_name);
  url.push(uri);
  return url.join('');
}