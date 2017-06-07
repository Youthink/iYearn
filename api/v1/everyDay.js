/**
 * Created by DuSong on 2017/4/21.
 */
const EveryDay     = require('../../proxy').EveryDay;
const { todayDate, todayDateTime }  = require('../../common/myMoment');

exports.checkWakeUp = function(req, res, next){
  const currentUser = req.session.user;
  const TodayDate = todayDate();

  EveryDay.getUserToday(currentUser._id, TodayDate, function(err, everyDay){
    if(!(everyDay && everyDay.wakeUpTime)){
      return res.json({
        success:true,
        wakeUp:false
      });
    }
    if (err) {
      return next(err);
    }
    return res.json({
      success:true,
      wakeUp:true
    });
  });
};

exports.wakeUp = function(req, res, next){
  const currentUser = req.session.user;

  const TodayDate = todayDate();
  const wakeUpTime = todayDateTime();

  EveryDay.newAndSave(currentUser._id, TodayDate, wakeUpTime, function (err) {
    if (err) {
      return next(err);
    }
    return res.json({success:true});
  });
};

exports.wakeUp = function(req, res, next){
  const currentUser = req.session.user;

  const TodayDate = todayDate();
  const wakeUpTime = todayDateTime();

  EveryDay.newAndSave(currentUser._id, TodayDate, wakeUpTime, function (err) {
    if (err) {
      return next(err);
    }
    return res.json({success:true});
  });
};

exports.wakeUpRank = function (req, res, next) {
  const TodayDate = todayDate();

  EveryDay.getRankByTodayDate(TodayDate, function(err,ranks){
    if (err) {
      return next(err);
    }
    return res.json({
      data:ranks,
      success:true
    });

  });
};
