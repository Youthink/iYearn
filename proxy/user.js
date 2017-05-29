const models  = require('../models');
const User    = models.User;
const uuid    = require('node-uuid');

/**
 * 根据昵称列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByNames = function (names, callback) {
  if (names.length === 0) {
    return callback(null, []);
  }
  User.find({ nickName: { $in: names } }, callback);
};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (loginName, callback) {
  User.findOne({'loginName': new RegExp('^'+loginName+'$', "i")}, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
  if (!id) {
    return callback();
  }
  User.findOne({_id: id}, callback);
};

/**
 * 根据微信小程序openid，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} openid 用户openid
 * @param {Function} callback 回调函数
 */
exports.getUserByOpenid = function (openid, callback) {
  if (!openid) {
    return callback();
  }
  User.findOne({wechatOpenId: openid}, callback);
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
  User.findOne({email: email}, callback);
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByIds = function (ids, callback) {
  User.find({'_id': {'$in': ids}}, callback);
};

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

/**
 * 根据查询条件，获取一个用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 用户名
 * @param {String} key 激活码
 * @param {Function} callback 回调函数
 */
exports.getUserByNameAndKey = function (loginName, key, callback) {
  User.findOne({loginName: loginName, retrieve_key: key}, callback);
};

exports.newAndSave = function (userInfo, callback) {
  const user         = new User();
  user.nickName      = userInfo.nickName;
  user.loginName     = userInfo.loginName;
  user.password      = userInfo.password;
  user.email         = userInfo.email;
  user.city          = userInfo.city;
  user.province      = userInfo.province;
  user.gender        = userInfo.gender;
  user.avatarUrl     = userInfo.avatarUrl;
  user.wechatOpenId  = userInfo.wechatOpenId;
  user.accessToken   = uuid.v4();
  user.signUpTime    = new Date();

  user.save(callback);
};