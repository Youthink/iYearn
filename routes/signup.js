
var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');

//GET 注册页
router.get('/', function(req,res,next){
  res.render("signup");
});

// POST 用户注册

router.post('/', function(req, res, next){
  console.log(req.fields.name);

  var name = req.fields.name;
  var password = req.fields.password;

  // 待写入数据库的用户信息
  var user = {
    name: name,
    password: password
  };
  // 用户信息写入数据库
  UserModel.create(user);
});

module.exports = router;