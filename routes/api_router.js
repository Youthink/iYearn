'use strict';

const express            = require('express');
const router             = express.Router();
const userController     = require('../api/v1/user');
const everyDayController = require('../api/v1/everyDay');
const authMiddleWare     = require('../middlewares/auth');


//login

// 用户
router.post('/wx/login', authMiddleWare.authUser, userController.login);
router.post('/everyday/wake-up', authMiddleWare.authUser, everyDayController.wakeUp);
router.post('/everyday/check-wake-up', authMiddleWare.authUser, everyDayController.checkWakeUp);
router.get('/everyday/wake-up-rank', everyDayController.wakeUpRank);




module.exports = router;