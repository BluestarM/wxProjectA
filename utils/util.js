const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatHours = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${[hour, minute].map(formatNumber).join(':')}`
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${[year, month, day].map(formatNumber).join('-')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay() - 1; //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //
var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();
//获得某月的天数
function getMonthDays(myMonth) {
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}

//获得本周的开始日期
function getWeekStartDate() {
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
  return formatDate(weekStartDate);
}
//获得本周的结束日期
function getWeekEndDate() {
  var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
  return formatDate(weekEndDate);
}
//获得上周的开始日期
function getLastWeekStartDate() {
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
  return formatDate(weekStartDate);
}
//获得上周的结束日期
function getLastWeekEndDate() {
  var weekEndDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1);
  return formatDate(weekEndDate);
}
//获得本月的开始日期
function getMonthStartDate() {
  var monthStartDate = new Date(nowYear, nowMonth, 1);
  return formatDate(monthStartDate);
}
//获得本月的结束日期
function getMonthEndDate() {
  var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
  return formatDate(monthEndDate);
}
//获得上月开始时间
function getLastMonthStartDate() {
  var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
  return formatDate(lastMonthStartDate);
}
//获得上月结束时间
function getLastMonthEndDate() {
  var lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
  return formatDate(lastMonthEndDate);
}



//毫秒转小时
const setHours = (time) => {
  let hours = Math.floor(time / 1000 / 60 / 60);
  return hours.toFixed(1)
}

const wxuuid = function () {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
 
  var uuid = s.join("");
  return uuid
}


const formatSeconds = function (value) { 
  var theTime = parseInt(value);// 需要转换的时间秒 
  var theTime1 = 0;// 分 
  var theTime2 = 0;// 小时 
  var theTime3 = 0;// 天
  if(theTime > 60) { 
   theTime1 = parseInt(theTime/60); 
   theTime = parseInt(theTime%60); 
   if(theTime1 > 60) { 
    theTime2 = parseInt(theTime1/60); 
    theTime1 = parseInt(theTime1%60); 
    if(theTime2 > 24){
     //大于24小时
     theTime3 = parseInt(theTime2/24);
     theTime2 = parseInt(theTime2%24);
    }
   } 
  } 
  var result = '';
  // if(theTime > 0){
  //  result = ""+parseInt(theTime)+"秒";
  // }
  if(theTime1 > 0) { 
   result = ""+parseInt(theTime1)+""+result; 
  } 
  if(theTime2 > 0) { 
   result = ""+parseInt(theTime2)+":"+result; 
  } 
  // if(theTime3 > 0) { 
  //  result = ""+parseInt(theTime3)+"天"+result; 
  // }
  return result; 
 }

module.exports = {
  formatTime: formatTime,
  wxuuid: wxuuid,
  formatSeconds: formatSeconds,
  formatDate: formatDate,
  formatHours: formatHours,
  getWeekStartDate: getWeekStartDate,
  getWeekEndDate: getWeekEndDate,
  getLastWeekStartDate: getLastWeekStartDate,
  getLastWeekEndDate: getLastWeekEndDate,
  getMonthStartDate: getMonthStartDate,
  getMonthEndDate: getMonthEndDate,
  getLastMonthStartDate: getLastMonthStartDate,
  getLastMonthEndDate: getLastMonthEndDate,
  setHours: setHours,
}
