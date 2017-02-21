const User         = require('../proxy').User;
const util         = require('util');



exports.index = function (req, res, next) {
  const userName = req.params.name;
  User.getUserByLoginName(userName, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.render404('这个用户不存在。');
      return;
    }

    const render = function () {
      user.url = (function () {
        if (user.url && user.url.indexOf('http') !== 0) {
          return 'http://' + user.url;
        }
        return user.url;
      })();

      res.render('user/index', {
        user: user,
        pageTitle: util.format('@%s 的个人主页', user.loginName),
      });
    };

    render();
  });
};