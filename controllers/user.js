const User         = require('../proxy').User;
const Every     = require('../proxy').Every;
const Follows     = require('../proxy').Follows;
const Message     = require('../proxy').Message;
const util         = require('util');
const eventproxy   = require('eventproxy');
const tools        = require('../common/tools');
const { todayDate, todayDateTime, monthDate, yearDate}  = require('../common/myMoment');

//用户主页
exports.index = function (req, res, next) {

  const userName = req.params.name;
  const editTodayPlan = req.query.editTodayPlan;
  const editTodaySummary = req.query.editTodaySummary;

  User.getUserByLoginName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render404('啊偶～～这个用户不存在。');
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

      Every.getUserEvery(user._id, TodayDate, function(err, Today){
        console.log('今天的日期', TodayDate);
        console.log('今天的日志', Today);
        if(Today&&Today.plan){
          todayPlan = Today.plan;
          showPlanTextarea = true;
        }
        if(editTodayPlan){
          showPlanTextarea = false;
        }

        if(Today&&Today.summary){
          todaySummary = Today.summary;
          showSummaryTextarea = true;
        }
        if(editTodaySummary){
          showSummaryTextarea = false;
        }

        Follows.getFollowsByUserId(req.session.user._id, function(err,follow){

          if(follow.length !== 0){
            isFollow = true;
          }
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

//用户的每月
exports.everyMonth = function (req, res, next){
  const userName = req.params.name;
  const editMonthPlan = req.query.editMonthPlan;
  const editMonthSummary = req.query.editMonthSummary;

  User.getUserByLoginName(userName, function (err, user) {
    if (err) {
      return next(err);
    }

    const MonthDate = monthDate();
    let monthPlan = '';
    let monthSummary = '';
    let showPlanTextarea = false;
    let showSummaryTextarea = false;
    let isFollow = false;

    Every.getUserEvery(user._id, MonthDate, function(err, Month){

      if(Month&&Month.plan){
        monthPlan = Month.plan;
        showPlanTextarea = true;
      }
      if(editMonthPlan){
        showPlanTextarea = false;
      }

      if(Month&&Month.summary){
        monthSummary = Month.summary;
        showSummaryTextarea = true;
      }
      if(editMonthSummary){
        showSummaryTextarea = false;
      }

      Follows.getFollowsByUserId(req.session.user._id, function(err,follow){

        if(follow.length !== 0){
          isFollow = true;
        }
        res.render('user/every-month', {
          monthPlan,
          monthSummary,
          isFollow,
          showSummaryTextarea,
          showPlanTextarea,
          user: user,
          pageTitle: util.format('@%s 的个人主页', user.name),
        });
      });
    });
  });
};

//用户的每年
exports.everyYear = function (req, res, next){
  const userName = req.params.name;
  const editYearPlan = req.query.editYearPlan;
  const editYearSummary = req.query.editYearSummary;

  User.getUserByLoginName(userName, function (err, user) {
    if (err) {
      return next(err);
    }

    const YearDate = yearDate();
    let yearPlan = '';
    let yearSummary = '';
    let showPlanTextarea = false;
    let showSummaryTextarea = false;
    let isFollow = false;

    Every.getUserEvery(user._id, YearDate, function(err, Year){

      if(Year&&Year.plan){
        yearPlan = Year.plan;
        showPlanTextarea = true;
      }
      if(editYearPlan){
        showPlanTextarea = false;
      }

      if(Year&&Year.summary){
        yearSummary = Year.summary;
        showSummaryTextarea = true;
      }
      if(editYearSummary){
        showSummaryTextarea = false;
      }

      Follows.getFollowsByUserId(req.session.user._id, function(err,follow){

        if(follow.length !== 0){
          isFollow = true;
        }
        res.render('user/every-year', {
          yearPlan,
          yearSummary,
          isFollow,
          showSummaryTextarea,
          showPlanTextarea,
          user: user,
          pageTitle: util.format('@%s 的个人主页', user.name),
        });
      });
    });
  });
};


//用户的以往
exports.searchPast = function (req, res, next){
  const searchKeyByDate = req.query.date;
  const userName = req.params.name;
  let isFollow = false;
  let result = null;

  User.getUserByLoginName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    Follows.getFollowsByUserId(req.session.user._id, function(err,follow){
      if(follow.length !== 0){
        isFollow = true;
      }
      if(!searchKeyByDate){
        return res.render('user/search-past', {
          result,
          isFollow,
          user: user,
          pageTitle: util.format('@%s 的个人主页', user.name),
        });
      }
      Every.getUserEvery(user._id, searchKeyByDate, function(err, every){
        if(every){
          result = every;
        }else{
          result = '没有查询到相关内容';
        }

        res.render('user/search-past', {
          result,
          isFollow,
          user: user,
          pageTitle: util.format('@%s 的个人主页', user.name),
        });
      });
    });
  });
};


//用户的关注
exports.myfollow = function (req, res, next){
  const userName = req.params.name;
  let isFollow = false;
  let followingArray = '';
  let followedArray = '';

  const ep = new eventproxy();

  User.getUserByLoginName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    Follows.getFollowsByUserId(req.session.user._id, function(err,f_ing){
      if(f_ing.length !== 0){
        isFollow = true;
        User.getUsersByIds(f_ing,function(err,following){
          followingArray = following;
          ep.emit('get_following');
        });
      }

    Follows.getFollowsByFollowing(req.session.user._id, function(err,f_ed){
        if(f_ed.length !== 0){
          isFollow = true;
          User.getUsersByIds(f_ed,function(err,followed){
            followedArray = followed;
            ep.emit('get_followed');
          });
        }

        ep.all('get_following','get_followed', function(){
          return res.render('user/my-follow', {
            followingArray,
            followedArray,
            isFollow,
            user: user,
            pageTitle: util.format('@%s 的个人主页', user.name),
          });
        });
      });
    });
  });
};


//用户个人设置
exports.showSettings = function (req, res, next){
  User.getUserById(req.session.user._id, function (err, user) {
    if (err) {
      return next(err);
    }
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
    return res.send({success:true});
  });
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

    return res.send({success:true});
  });
};

exports.allUser = function (req, res){
    const user = req.session.user || null;
    return res.render('user/alluser', {user: user});
};

exports.message = function (req, res, next){
  Message.getUnreadMessageByUserId(req.session.user._id,function(err,messages){
    if(err){
      return next(err);
    }
    Message.updateMessagesToRead(req.session.user._id,messages,function(err){
      if(err){
        return next(err);
      }
      return res.render('messages',{messages:messages});
    });
  });
};



