const models      =  require('../models');
const EveryDay    =  models.EveryDay;

//根据今天的日期，查询是否有早签到记录

exports.getUserTodayWakeUpTime = function (loginName, TodayDate, callback) {
  if (!loginName) {
    return callback();
  }

  EveryDay.findOne({loginName: loginName, TodayDate: TodayDate}, callback);
};

//根据今天的日期，查询所有有早起记录的用户

exports.getRankByTodayDate = function (TodayDate, callback) {
  EveryDay.find({TodayDate}, callback);
};

exports.newAndSave = function (loginName, TodayDate, wakeUpTime, callback) {
  const everyDay       = new EveryDay();
  everyDay.loginName   = loginName;
  everyDay.TodayDate   = TodayDate;
  everyDay.wakeUpTime  = wakeUpTime;

  everyDay.save(callback);
};