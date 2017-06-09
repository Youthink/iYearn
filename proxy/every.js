const models      =  require('../models');
const Every       =  models.Every;

//根据日期，查询数据库记录
exports.getUserEvery = function (userId, Date, callback) {
  if (!userId) {
    return callback();
  }

  Every.findOne({userId: userId, Date: Date}, callback);
};

//更新计划
exports.updatePlan = function (plan, callback) {
  Every.findOne({userId: plan.userId, Date: plan.Date}, function(err, p){
    if (err || !p) {
      return callback(err);
    }
    p.plan = plan.plan;
    p.save(callback);
  });
};

//更新总结
exports.updateSummary = function (summary, callback) {
  console.log(summary);
  Every.findOne({userId: summary.userId, Date: summary.Date}, function(err, s){
    if (err || !s) {
      return callback(err);
    }
    s.summary = summary.summary;
    s.save(callback);
  });
};

exports.newAndSave = function (e, callback) {
  const every       = new Every();
  every.userId      = e.userId;
  every.Date        = e.Date;
  every.wakeUpTime  = e.wakeUpTime;
  every.plan        = e.plan;
  every.summary     = e.summary;

  every.save(callback);
};