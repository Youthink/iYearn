'use strict';

const express = require('express');
const router = express.Router();
const sign = require('../controllers/sign');
const user = require('../controllers/user');
const everyDay = require('../controllers/everyDay');
const auth = require('../middlewares/auth');


router.get('/signin', sign.showLogin);     // 进入登录页
router.post('/signin', sign.login);        // 登录验效
router.get('/signup', sign.showSignup);    // 进入注册页
router.post('/signup', sign.signup);       // 用户注册
router.post('/signout', sign.signout);     // 用户登出

router.get('/settings', auth.userRequired, user.showSettings); // 用户个人设置页面
router.post('/settings/avatar', auth.userRequired, user.settingAvatar);//设置个人头像
router.post('/settings/base', auth.userRequired, user.settingBase);//设置个人信息
router.post('/settings', auth.userRequired, user.updatePwd);//更新密码
router.get('/user/:name', user.index);     // 用户个人主页
router.post('/user/:name/wake-up', user.wakeUp); // 起床签到


router.post('/alluser', user.search); // 搜索用户
router.post('/follow', auth.userRequired, user.follow); // 关注好友
router.post('/unfollow', auth.userRequired, user.unfollow); // 取消关注

router.get('/message', auth.userRequired, user.message); // 我的消息

router.post('/every-day/add-diary', everyDay.addDiary); // 添加今日计划
router.post('/every-day/add-summary', everyDay.addSummary); // 添加今日成就

router.post('/every-week/add-week-plan', everyDay.addWeekPlan); // 添加周计划
router.post('/every-week/add-week-summary', everyDay.addWeekSummary); // 添加周成就

router.post('/every-month/add-month-plan', everyDay.addMonthPlan); // 添加月计划
router.post('/every-month/add-month-summary', everyDay.addMonthSummary); // 添加月成就

router.post('/every-year/add-year-plan', everyDay.addWeekPlan); // 添加年计划
router.post('/every-year/add-year-summary', everyDay.addYearSummary); // 添加年成就

router.get('/alluser', user.allUser); // 成员页面

router.get('/wake-up-rank', user.wakeUpRank); // 早起排名


module.exports = router;




