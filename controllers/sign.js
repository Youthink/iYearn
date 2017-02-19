const validator = require('validator');

//sign up
exports.showSignup = function (req, res) {
  res.render('sign/signup');
};

//login
exports.showLogin = function (req, res) {
  res.render('sign/signin');
};

exports.signup = function (req, res, next){
  console.log(req.body.loginname);
  const loginname = validator.trim(req.body.loginname).toLowerCase();


};