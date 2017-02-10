var express = require('express');
var router  = express.Router();

// GET /signin 登录页
router.get('/', function(req, res, next) {
  res.render('signin');
});

// POST /signin 用户登录
router.post('/', function(req, res, next) {


  console.log(req.fields.name);

});


module.exports = router;


