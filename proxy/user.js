const models  = require('../models');
const User    = models.User;
const uuid    = require('node-uuid');

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
  User.find(query, '', opt, callback);
};

exports.newAndSave = function (name, loginName, password, email, callback) {
  const user       = new User();
  user.name        = loginName;
  user.loginName   = loginName;
  user.password    = password;
  user.email       = email;
  user.accessToken = uuid.v4();

  user.save(callback);
};