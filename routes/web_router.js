'use strict';

const express = require('express');
const router = express.Router();
const sign = require('../controllers/sign');


router.get('/signin', sign.showLogin); // 进入登录页
router.post('/signin', sign.login); // 登录验效
router.get('/signup', sign.showSignup); // 进入注册页
router.post('/signup', sign.signup); // 用户注册


module.exports = router;




