var sha1    = require('sha1');
var express = require('express');
var router  = express.Router();

var UserModel     = require('../model/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

//GET /signin 登录页
router.get('/', checkNotLogin, function(req, res, next){ 
		var name     = req.fileds.name;
		var password = req.fileds.password;
    
		UserModel.getUserByName(name)
				.then(function(user){
						if(!user){
								res.flash('error', '用户不存在');
								return res.redirect('back'); 
						}

						//检查密码是否匹配
						if(sha1(password) !== user.possword){
								res.flash('error', '用户名或密码错误');
								return res.redirect('back'); 
						}
						res.flash('success', '登录成功');
						//用户信息写入 session 
						delete user.password;
						req.session.user = user;
						//跳到主页
						res.redirect('/posts');
				})
		.catch(next);
});

module.exports = router;
