'use strict';

const express = require('express');
const router = express.Router();
const sign = require('../controllers/sign');
const user = require('../controllers/user');


router.get('/signin', sign.showLogin); // 进入登录页
router.post('/signin', sign.login); // 登录验效
router.get('/signup', sign.showSignup); // 进入注册页
router.post('/signup', sign.signup); // 用户注册
router.post('/signout', sign.signout); // 用户登出
router.get('/user/:name', user.index); // 用户个人主页

router.post('/user/:name/sleep', user.sleep); // 用户睡眠


module.exports = router;




