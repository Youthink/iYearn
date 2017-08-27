
const date     = new Date();
const y        = date.getFullYear();
const month    = date.getMonth() + 1;
const day      = date.getDate();
const hour     = date.getHours();
const minutes  = date.getMinutes();
const seconds  = date.getSeconds();

const m = addPreZero(month);
const d = addPreZero(day);
const h = addPreZero(hour);
const mm = addPreZero(minutes);
const ss = addPreZero(seconds);


function addPreZero(value) {
  return value > 9 ? value : '0' + value;
}

exports.todayDate = function () {
  console.log("common 文件，今天的时间：", y + "" + m + "" + d);
  return y + "" + m + "" + d;
};

exports.monthDate = function () {
  return y + "" + m;
};

exports.yearDate = function () {
  return y;
};

exports.todayDateTime = function () {
  return h + ":" + mm + ":" + ss;
};


