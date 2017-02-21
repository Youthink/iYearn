const mongoose   = require('mongoose');
const UserModel  = mongoose.model('User');
const config     = require('config-lite');
const eventproxy = require('eventproxy');
const UserProxy  = require('../proxy').User;


/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
  if (!req.session || !req.session.user || !req.session.user._id) {
    return res.status(403).send('forbidden!');
  }

  next();
};


function gen_session(user, res) {
  const auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  const opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    signed: false,
    httpOnly: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}

exports.gen_session = gen_session;
