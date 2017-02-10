const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const express = require('express');
const router = express.Router();
const UserModel = require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin;


//GET 注册页
router.get('/', checkNotLogin, function(req, res, next){
  res.render("signup");
});

// POST 用户注册

router.post('/', checkNotLogin, function(req, res, next){

  const name = req.fields.name;
  let password = req.fields.password;

  // 明文密码加密
  password = sha1(password);

  // 待写入数据库的用户信息
  let user = {
    name: name,
    password: password
  };
  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
      // 此 user 是插入 mongodb 后的值，包含 _id
      user = result.ops[0];
      // 将用户信息存入 session
      delete user.password;
      req.session.user = user;
      // 写入 flash
      req.flash('success', '注册成功');
      // 跳转到首页
      res.redirect('/');
    })
    .catch(function (e) {
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('E11000 duplicate key')) {
        req.flash('error', '用户名已被占用');
        return res.redirect('/signup');
      }
      next(e);
    });
});

module.exports = router;