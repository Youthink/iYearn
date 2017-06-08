const User         = require('../proxy').User;
const EveryDay     = require('../proxy').EveryDay;
const Follows     = require('../proxy').Follows;
const Message     = require('../proxy').Message;
const util         = require('util');
const eventproxy   = require('eventproxy');
const tools        = require('../common/tools');
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
      let isFollow = false;

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

        Follows.getFollowsByUserId(req.session.user._id, function(err,follow){

          if(follow.length !== 0){
            isFollow = true;
          }
          console.log(isFollow);
          res.render('user/index', {
            todayPlan,
            todaySummary,
            isFollow,
            showSummaryTextarea,
            showPlanTextarea,
            user: user,
            wakeUped,
            pageTitle: util.format('@%s 的个人主页', user.name),
          });
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

//设置基本信息
exports.settingBase = function (req, res, next){
  const userId = req.session.user._id;
  const nickName = req.body.nickName;
  const userInfo = {
    userId: userId,
    nickName: nickName
  };
  User.updateUserInfo(userInfo, function (err, user) {
    if(err){
      return next(err);
    }

    return res.redirect('/user/' + user.loginName);
  })

};

//更新密码
exports.updatePwd = function (req, res, next){
  const userId = req.session.user._id;
  const oldPwd = req.body.oldPwd;
  const newPwd = req.body.newPwd;
  const ep        = new eventproxy();

  User.getUserById(userId, (err, user) => {
    if(err){
      return next(err);
    }
    tools.bcompare(oldPwd, user.password, ep.done(function (bool) {
      if(!bool){
        return res.render('user/settings', {user: user, error: '原密码错误'});
      }

      tools.bhash(newPwd, ep.done(function (passhash) {
        const userInfo = {
          userId:userId,
          password: passhash
        };

        User.updateUserPwd(userInfo, function (err) {
          if(err){
            return next(err);
          }
          return res.redirect('/signin');
        })
      }));
    }));
  });
};

exports.search = function (req, res, next){
  const key = req.body.searchAllUser;
  User.getUserByLoginName(key, function(err,resultUser){
    if(err){
      return next(err);
    }

    if(!resultUser){
      return res.render('user/alluser',{error: "该用户不存在" });
    }

    return res.render('user/alluser',{resultUser:resultUser});
  });
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

exports.follow = function (req, res, next){
  const currentUser = req.session.user;
  const userId = currentUser._id;
  const friendId = req.body.friendId;

  Follows.newAndSave(userId, friendId, function (err) {
    if (err) {
      return next(err);
    }

    User.updateFollowingCount(userId,function(err){
      if (err) {
        return next(err);
      }
    });

    User.updateFollowedCount(friendId,function(err){
      if (err) {
        return next(err);
      }
    });
    const content = currentUser.nickName + '关注了你';
    Message.sendMessage(friendId,currentUser.loginName,content,function(err){
      if(err){
        return next(err);
      }
    });
  });
  return next();
};

exports.unfollow = function (req, res, next){
  const currentUser = req.session.user;
  const userId = currentUser._id;
  const friendId = req.body.friendId;

  Follows.remove(userId, friendId, function (err) {
    if (err) {
      return next(err);
    }

    User.getUserById(userId, function (err, user) {
      if (err) {
        return next(err);
      }
      user.following_count -= 1;
      req.session.user = user;
      user.save();
    });
    User.getUserById(friendId, function (err, user) {
      if (err) {
        return next(err);
      }
      user.followed_count -= 1;
      user.save();
    });
  });

  return next();
};

exports.allUser = function (req, res, next){
    const user = req.session.user || null;
    return res.render('user/alluser', {user: user});
};

exports.message = function (req, res, next){
  Message.getUnreadMessageByUserId(req.session.user._id,function(err,messages){
    if(err){
      return next(err);
    }
    res.render('messages',{messages:messages});

    Message.updateMessagesToRead(req.session.user._id,messages,function(err){
      if(err){
        return next(err);
      }
    });
  });
};



