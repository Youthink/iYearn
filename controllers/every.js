const User         = require('../proxy').User;
const Every        = require('../proxy').Every;
const util         = require('util');
const { todayDate, monthDate, yearDate}  = require('../common/myMoment');

//添加日志
exports.addPlan = function (req, res, next) {
  const plan = req.body.plan;
  const dataType = req.body.dateType;
  const user  = req.session.user;
  const userId = user._id;
  const userName = user.loginName;
  const TodayDate = todayDate();
  const MonthDate = monthDate();
  const YearDate = yearDate();

  let date = {
    day   : TodayDate,
    month : MonthDate,
    year  : YearDate
  }[dataType];

  let url = {
    day   : '/user/'+ userName,
    month : '/user/'+ userName + '/every-month',
    year  : '/user/'+ userName + '/every-year'
  }[dataType];

  const e ={
    userId: userId,
    Date: date,
    plan:plan
  };

  Every.getUserEvery(userId,date,(err,every) => {
    if(!every){
      Every.newAndSave(e,(err) => {
        if (err) {
          return next(err);
        }
        res.redirect(url);
      });
      return next();
    }
    Every.updatePlan(e, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(url);
    })
  });
};

//添加成就
exports.addSummary = function (req, res, next) {
  const diarySummary = req.body.diarySummary;
  const dataType = req.body.dateType;
  const user  = req.session.user;
  const userId = user._id;
  const userName = user.loginName;
  const TodayDate = todayDate();
  const MonthDate = monthDate();
  const YearDate = yearDate();


  let date = {
    day   : TodayDate,
    month : MonthDate,
    year  : YearDate
  }[dataType];

  let url = {
    day   : '/user/'+ userName,
    month : '/user/'+ userName + '/every-month',
    year  : '/user/'+ userName + '/every-year'
  }[dataType];

  const e ={
    userId: userId,
    Date: date,
    summary: diarySummary
  };

  Every.getUserEvery(userId,date,(err,every) => {
    if(!every){
      Every.newAndSave(e,(err) => {
        if (err) {
          return next(err);
        }
        res.redirect(url);
      });
      return next();
    }
    Every.updateSummary(e, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(url);
    })
  });
};

exports.showPost = function (req, res, next) {
  const diary = req.body.diary;

  console.log(diary);
};