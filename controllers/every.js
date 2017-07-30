const User         = require('../proxy').User;
const Every        = require('../proxy').Every;
const Follows        = require('../proxy').Follows;
const Message        = require('../proxy').Message;
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

  let text = {
    day   : '今日',
    month : '本月',
    year  : '今年'
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
        Follows.getFollowsByFollowing(userId,function(err,following){
          const content = userName + '创建了新的'+ text +'计划赶快去看看吧';
          following.map((user)=>{
            Message.sendMessage(user.userId,userName,content,function(err){
              if(err){
                return next(err);
              }
            });
          });
          return res.redirect(url);
        });
      });
      return ;
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

  let text = {
    day   : '今日',
    month : '本月',
    year  : '今年'
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
      Follows.getFollowsByFollowing(userId,function(err,following){
        const content = userName + '创建了新的'+ text +'成就赶快去看看吧';
        following.map((user)=>{
          Message.sendMessage(user.userId,userName,content,function(err){
            if(err){
              return next(err);
            }
          });
        });
        return res.redirect(url);
      });
      });
      return ;
    }
    Every.updateSummary(e, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect(url);
    })
  });
};