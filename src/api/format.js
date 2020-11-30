// Date to CHN
export function formatDate(d) {
  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const seconds = d.getSeconds()
  const seconds1 = (((seconds + '').length) == 1) ? '0' + seconds : seconds
  const hour1 = (((hour + '').length) == 1) ? '0' + hour : hour
  const minute1 = (((minute + '').length) == 1) ? '0' + minute : minute
  return year + '年' + month + '月' + day + '日 ' + hour1 + ':' + minute1 + ':' + seconds1
// "M+" : this.getMonth()+1,                 //月份
// "d+" : this.getDate(),                    //日
// "h+" : this.getHours(),                   //小时
// "m+" : this.getMinutes(),                 //分
// "s+" : this.getSeconds(),                 //秒
// "q+" : Math.floor((this.getMonth()+3)/3), //季度
// "S"  : this.getMilliseconds()
}
