'use strict';

const express = require('express');
const router = express.Router();
const sign = require('../controllers/sign');


// GET /signin 登录页
router.get('/signin', sign.showLogin);

// GET /signup 注册页
router.get('/signup', sign.showSignup);

// POST /signup 用户注册
router.post('/signup', sign.signup);


module.exports = router;




