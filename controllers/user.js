const User         = require('../proxy').User;
const EveryDay     = require('../proxy').EveryDay;
const util         = require('util');
const { todayDate, todayDateTime}  = require('../common/myMoment');

exports.index = function (req, res, next) {
  const userName = req.params.name;
  User.getUserByLoginName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render404('这个用户不存在。');
      return;
    }

    const render = function () {
      user.url = (function () {
        if (user.url && user.url.indexOf('http') !== 0) {
          return 'http://' + user.url;
        }
        return user.url;
      })();
      const TodayDate = todayDate();
      let wakeUped = false;
      EveryDay.getUserTodayWakeUpTime(user.loginName, TodayDate, function(err, everyDay){
        if(everyDay){
          wakeUped = true;
        }

        res.render('user/index', {
          user: user,
          wakeUped,
          pageTitle: util.format('@%s 的个人主页', user.loginName),
        });
      });
    };

    render();
  });
};


exports.sleep = function (req, res, next){
  const currentUser = req.session.user;
  console.log(currentUser + '睡觉');
  return next();
};

exports.wakeUp = function (req, res, next){
  const currentUser = req.session.user.name;
  const TodayDate = todayDate();
  const wakeUpTime = todayDateTime();

  EveryDay.newAndSave(currentUser, TodayDate, wakeUpTime, function (err) {
    if (err) {
      return next(err);
    }
  });

  res.redirect('/wake-up-rank');
};

exports.wakeUpRank = function (req, res) {
  const TodayDate = todayDate();
  EveryDay.getRankByTodayDate(TodayDate, function(err,rank){
    res.render('wake-up-rank', {rank});
  });
};

