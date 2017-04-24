'use strict';

const express        = require('express');
const router         = express.Router();
const user           = require('../api/v1/user');
const everyDay       = require('../api/v1/everyDay');

router.post('/user/:name/wake-up', user.wakeUp); // 起床签到

router.get('/wake-up-rank', user.wakeUpRank); // 早起排名


module.exports = router;