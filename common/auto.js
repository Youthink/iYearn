/*自动整理每日成就到月成就*/
const mongoose = require('mongoose');
const config = require('config-lite');
const logger = require('../common/logger');

mongoose.connect(config.mongodb, {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', config.mongodb, err.message);
    process.exit(1);
  }
});

// models
require('./user');
require('./every');

User    = mongoose.model('User');
Every = mongoose.model('Every');

User.get

//根据日期，查询数据库记录
Every.getUserEvery(userId, Date, callback) {
  if (!userId) {
    return callback();
  }

  Every.findOne({userId: userId, Date: Date}, callback);
};

