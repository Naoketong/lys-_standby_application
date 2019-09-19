const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatTime = date => {
  const year   = date.getFullYear()
  const month  = date.getMonth() + 1
  const day    = date.getDate()
  const hour   = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  const year   = date.getFullYear()
  const month  = date.getMonth() + 1
  const day    = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatMin = time => {
  if(!time) {
    return '-'
  }

  let timeArr = time.split(':');
  return timeArr[0] + ':' + timeArr[1];
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatMin: formatMin,
}