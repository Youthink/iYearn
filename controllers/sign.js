const validator      = require('validator');
const eventproxy     = require('eventproxy');
const tools          = require('../common/tools');



//GET sign up
exports.showSignup = function (req, res) {
  res.render('sign/signup');
};

exports.signup = function (req, res, next){
  const loginName      = validator.trim(req.body.loginname).toLowerCase();
  const email          = validator.trim(req.body.email).toLowerCase();
  const password       = validator.trim(req.body.password);
  const rePassword     = validator.trim(req.body.re_password);
  const invitationCode = validator.trim(req.body.invitation_code);

  const ep = new eventproxy();  //这一段不是很明白，待定
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.status(422);
    res.render('sign/signup', {error: msg, loginname: loginName, email: email});
  });

  // 验证信息的正确性
  if ([loginName, password, rePassword, email].some(function (item) { return item === ''; })) {
    ep.emit('prop_err', '信息不完整。');
    return;
  }
  if (loginName.length < 5) {
    ep.emit('prop_err', '用户名至少需要5个字符。');
    return;
  }
  if (!tools.validateId(loginName)) {
    return ep.emit('prop_err', '用户名不合法。');
  }
  if (!validator.isEmail(email)) {
    return ep.emit('prop_err', '邮箱不合法。');
  }
  if (password !== rePassword) {
    return ep.emit('prop_err', '两次密码输入不一致。');
  }
  if (!invitationCode) {
    return ep.emit('prop_err', '请填写邀请码。');
  }
  // END 验证信息的正确性


};

//GET login
exports.showLogin = function (req, res) {
  res.render('sign/signin');
};