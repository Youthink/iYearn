'use strict';

const express = require('express');
const router = express.Router();
const sign = require('../controllers/sign');
const user = require('../controllers/user');
const everyDay = require('../controllers/everyDay');


router.get('/signin', sign.showLogin);     // 进入登录页
router.post('/signin', sign.login);        // 登录验效
router.get('/signup', sign.showSignup);    // 进入注册页
router.post('/signup', sign.signup);       // 用户注册
router.post('/signout', sign.signout);     // 用户登出

router.get('/settings', user.showSettings); // 用户个人设置
router.get('/user/:name', user.index);     // 用户个人主页
router.post('/user/:name/sleep', user.sleep); // 晚上睡前签到
router.post('/user/:name/wake-up', user.wakeUp); // 起床签到

router.post('/user/:name/habit/add', user.addHabit); // 添加习惯
router.post('/user/:name/habit/delete', user.deleteHabit); // 删除习惯
router.post('/user/:name/habit/complete', user.completeHabit); // 添加习惯
router.post('/user/:name/habit/cancel', user.cancelHabit); // 删除习惯

router.get('/wake-up-rank', user.wakeUpRank); // 早起排名


module.exports = router;




