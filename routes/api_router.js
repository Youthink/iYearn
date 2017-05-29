'use strict';

const express        = require('express');
const router         = express.Router();
const userController = require('../api/v1/user');
const authMiddleWare = require('../middlewares/auth');


//login

// 用户
router.post('/wx/login', authMiddleWare.authUser, userController.login);


module.exports = router;