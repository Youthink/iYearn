const models      =  require('../models');
const EveryDay    =  models.EveryDay;
const User        = require('./user');
const eventproxy  = require('eventproxy');


//根据今天的日期，查询是否有早签到记录

exports.getUserTodayWakeUpTime = function (userId, TodayDate, callback) {
  if (!userId) {
    return callback();
  }

  EveryDay.findOne({userId: userId, TodayDate: TodayDate}, callback);
};

//根据今天的日期，查询所有有早起记录的用户

exports.getRankByTodayDate = function (TodayDate, callback) {

  EveryDay.find({TodayDate}).lean()
    .exec((err, ranks) => {
      if (err) {
        return callback(err);
      }
      if (ranks.length === 0) {
        return callback(null, []);
      }

      const proxy = new eventproxy();
      proxy.after('rank_ready', ranks.length, function () {
        return callback(null, ranks);
      });
      proxy.fail(callback);

      ranks.forEach(function(rank, i){
        const ep = new eventproxy();
        ep.all('user', function (user) {
          //rank = rank.toObject();
          if (user) {
            rank.user = {
              nickName  : user.nickName,
              avatarUrl : user.avatarUrl
            };
          } else {
            ranks[i] = null;
          }
          proxy.emit('rank_ready');
        });
        User.getUserById(rank.userId,ep.done('user'));
      });
  });
};

exports.newAndSave = function (userId, TodayDate, wakeUpTime, callback) {
  const everyDay       = new EveryDay();
  everyDay.userId      = userId;
  everyDay.TodayDate   = TodayDate;
  everyDay.wakeUpTime  = wakeUpTime;

  everyDay.save(callback);
};