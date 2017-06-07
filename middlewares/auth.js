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
    return res.redirect('/signin');
  }
  next();
};

function gen_session(user, res) {
  const auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  const opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    signed: true,
    httpOnly: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天

  return res._headers['set-cookie'];
}

exports.gen_session = gen_session;

// 验证用户是否登录
exports.authUser = function (req, res, next) {
  const ep = new eventproxy();
  ep.fail(next);

  // Ensure current_user always has defined.
  res.locals.current_user = null;

  if (config.debug && req.cookies['mock_user']) {
    const mockUser = JSON.parse(req.cookies['mock_user']);
    req.session.user = new UserModel(mockUser);
    if (mockUser.is_admin) {
      req.session.user.is_admin = true;
    }
    return next();
  }

  ep.all('get_user', function (user) {

    if (!user) {
      return next();
    }
    user = res.locals.current_user = req.session.user = new UserModel(user);

    if (config.admins.hasOwnProperty(user.loginName)) {
      user.is_admin = true;
    }
    return next();
  });

  if (req.session.user) {
    ep.emit('get_user', req.session.user);
  } else {
    const auth_token = req.signedCookies[config.auth_cookie_name];
    if (!auth_token) {
      return next();
    }

    const auth = auth_token.split('$$$$');
    const user_id = auth[0];
    UserProxy.getUserById(user_id, ep.done('get_user'));
  }
};
