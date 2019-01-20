const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const res = [year, month, day].map(formatNumber);
  return `${res[0]}年${res[1]}月${res[2]}日`
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatPrice = n => {
  const decimal = n % 100;
  return parseInt(n / 100) + (decimal ? ('.' + decimal) : '');
}

module.exports = {
  formatTime,
  formatNumber,
  formatPrice,
  formatDate
}
