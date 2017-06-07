const User         = require('../proxy').User;
const EveryDay     = require('../proxy').EveryDay;
const util         = require('util');
const { todayDate, todayDateTime}  = require('../common/myMoment');

//添加日志
exports.addDiary = function (req, res, next) {
  const diary = req.body.diary;
  const user  = req.session.user;
  const userId = user._id;
  const userName = user.loginName;
  const TodayDate = todayDate();

  EveryDay.getUserToday(userId,TodayDate,(err,today) => {
    if(!today){
      EveryDay.newAndSave(userId,TodayDate,null,diary,(err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/user/'+ userName);
      });
    }
    EveryDay.updateTodayDiary(userId, TodayDate, diary, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/user/'+ userName);
    })
  });
};

exports.addSummary = function (req, res, next) {
  const diary = req.body.diary;

  console.log(diary);
};

exports.addWeekPlan = function (req, res, next) {
  const diary = req.body.diary;

  console.log(diary);
};

exports.addWeekSummary = function (req, res, next) {
  const diary = req.body.diary;

  console.log(diary);
};

exports.addMonthPlan = function (req, res, next) {
  const diary = req.body.diary;

  console.log(diary);
};

exports.addMonthSummary = function (req, res, next) {
  const diary = req.body.diary;

  console.log(diary);
};

exports.addYearPlan = function (req, res, next) {
  const diary = req.body.diary;

  console.log(diary);
};

exports.addYearSummary = function (req, res, next) {
  const diary = req.body.diary;

  console.log(diary);
};