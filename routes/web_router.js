'use strict';

const express = require('express');
const router = express.Router();
const sign = require('../controllers/sign');
const user = require('../controllers/user');
const every = require('../controllers/every');
const auth = require('../middlewares/auth');
const about = require('../controllers/about');

router.get('/', function(req, res) {
   res.redirect('/signin');
});

router.get('/signin', sign.showLogin);     // 进入登录页
router.post('/signin', sign.login);        // 登录验效
router.get('/signup', sign.showSignup);    // 进入注册页
router.post('/signup', sign.signup);       // 用户注册
router.post('/signout', sign.signout);     // 用户登出

router.get('/settings', auth.userRequired, user.showSettings); // 用户个人设置页面
router.post('/settings/avatar', auth.userRequired, user.settingAvatar);//设置个人头像
router.post('/settings/base', auth.userRequired, user.settingBase);//设置个人信息
router.post('/settings', auth.userRequired, user.updatePwd);//更新密码
router.get('/user/:name', auth.userRequired,user.index);     // 用户个人主页
router.get('/user/:name/every-month', user.everyMonth);     // 用户的每月
router.get('/user/:name/every-year', user.everyYear);     // 用户的每年
router.get('/user/:name/search-past', user.searchPast);     // 用户的每年
router.get('/user/:name/follow', user.myfollow);     // 用户的关注

router.post('/alluser', user.search); // 搜索用户
router.post('/follow', auth.userRequired, user.follow); // 关注好友
router.post('/unfollow', auth.userRequired, user.unfollow); // 取消关注

router.get('/message', auth.userRequired, user.message); // 我的消息

router.post('/every/add-plan', every.addPlan); // 添加今日计划
router.post('/every/add-summary', every.addSummary); // 添加今日成就

router.get('/alluser', user.allUser); // 成员页面
router.get('/about', about.about); // 关于页面

module.exports = router;

