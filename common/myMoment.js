function getDate(){
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
  return {
    y,m,d,mm,ss
  }
}

function addPreZero(value) {
  return value > 9 ? value : '0' + value;
}

exports.todayDate = function () {
  const { y, m, d } = getDate();
  return y + "" + m + "" + d;
};

exports.monthDate = function () {
  const { y, m } = getDate();
  return y + "" + m;
};

exports.yearDate = function () {
  const { y } = getDate();
  return y;
};

exports.todayDateTime = function () {
  const { h, mm, ss } = getDate();
  return h + ":" + mm + ":" + ss;
};

