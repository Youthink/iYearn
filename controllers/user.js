const User         = require('../proxy').User;
const EveryDay     = require('../proxy').EveryDay;
const util         = require('util');
const { todayDate, todayDateTime}  = require('../common/myMoment');

//用户主页
exports.index = function (req, res, next) {

  const userName = req.params.name;
  const editTodayPlan = req.query.editTodayPlan;
  const editTodaySummary = req.query.editTodaySummary;
  const searchEveryDayByDate = req.query.date;
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
      let todaySummary = '';
      let showPlanTextarea = false;
      let showSummaryTextarea = false;

      // if(searchEveryDayByDate){
      //   EveryDay.getUserToday(user._id, searchEveryDayByDate, function(err, Today){
      //     if(Today&&Today.diary){
      //       todayPlan = Today.diary;
      //     }
      //     if(Today&&Today.diarySummary){
      //       todaySummary = Today.diarySummary;
      //     }
      //     res.render('user/index', {
      //       todayPlan,
      //       todaySummary,
      //       showSummaryTextarea,
      //       showPlanTextarea,
      //       user: user,
      //       wakeUped,
      //       pageTitle: util.format('@%s 的个人主页', user.name),
      //     });
      //   })
      //
      // }

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

        if(Today&&Today.diarySummary){
          todaySummary = Today.diarySummary;
          showSummaryTextarea = true;
        }
        if(editTodaySummary){
          showSummaryTextarea = false;
        }

        res.render('user/index', {
          todayPlan,
          todaySummary,
          showSummaryTextarea,
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
    console.log(user);
    return res.render('user/settings', {user: user});
  });
};

//上传头像
exports.settingAvatar = function (req, res, next){
  const userId = req.session.user._id;
  const avator = req.files[0].path;

  User.updateAvatar(userId, avator.slice(6), function (err, user) {
    if(err){
      return next(err);
    }

    return res.redirect('/settings');
  })

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

