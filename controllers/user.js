const User         = require('../proxy').User;
const EveryDay     = require('../proxy').EveryDay;
const util         = require('util');
const { todayDate, todayDateTime}  = require('../common/myMoment');

//用户主页
exports.index = function (req, res, next) {

  const userName = req.params.name;
  const editTodayPlan = req.query.editTodayPlan;
  User.getUserByLoginName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      //res.render404('这个用户不存在。');
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
      let todayPlan = '';
      let showPlanTextarea = false;
      EveryDay.getUserToday(user._id, TodayDate, function(err, Today){
        if(Today&&Today.wakeUpTime){
          wakeUped = true;
        }

        if(Today&&Today.diary){
          todayPlan = Today.diary;
          showPlanTextarea = true;
        }
        if(editTodayPlan){
          showPlanTextarea = false;
        }
        res.render('user/index', {
          todayPlan,
          showPlanTextarea,
          user: user,
          wakeUped,
          pageTitle: util.format('@%s 的个人主页', user.name),
        });
      });
    };

    render();
  });
};

//用户个人设置

exports.showSettings = function (req, res, next){
  User.getUserById(req.session.user._id, function (err, user) {
    if (err) {
      return next(err);
    }
    if (req.query.save === 'success') {
      user.success = '保存成功。';
    }
    user.error = null;
    return res.render('user/settings', {user: user});
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

exports.addHabit = function (req, res, next){
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

exports.deleteHabit = function (req, res) {
  const TodayDate = todayDate();
  EveryDay.getRankByTodayDate(TodayDate, function(err,rank){
    res.render('wake-up-rank', {rank});
  });
};

exports.completeHabit = function (req, res, next) {
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

exports.cancelHabit = function (req, res) {
  const TodayDate = todayDate();
  EveryDay.getRankByTodayDate(TodayDate, function(err,rank){
    res.render('wake-up-rank', {rank});
  });
};

exports.allUser = function (req, res, next){
    const user = req.session.user || null;
    return res.render('user/alluser', {user: user});
};

