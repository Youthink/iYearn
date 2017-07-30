const models      =  require('../models');
const Follows    =  models.Follows;
const User        = require('./user');
const eventproxy  = require('eventproxy');



exports.getFollowsByUserId = function (userId, callback) {
  Follows.find({userId: userId}, callback);
};

exports.getFollowsByFollowing = function (following, callback) {
  Follows.find({following: following}, callback);
};

exports.remove = function (userId, friendId, callback) {
  Follows.remove({userId: userId, following: friendId}, callback);
};

exports.newAndSave = function (userId, followingId, callback) {
  const Follow      = new Follows();
  Follow.userId      = userId;
  Follow.following   = followingId;

  Follow.save(callback);
};