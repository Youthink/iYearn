const validator      = require('validator');
const eventproxy     = require('eventproxy');
const tools          = require('../common/tools');
const User           = require('../proxy').User;
const InvitationCode = require('../proxy').InvitationCode;
const config         = require('config-lite');
const authMiddleWare = require('../middlewares/auth');





//GET sign up
exports.showSignup = function (req, res) {
  res.render('sign/signup');
};

exports.signup = function (req, res, next) {
  const loginName      = validator.trim(req.body.loginname).toLowerCase();
  const email          = validator.trim(req.body.email).toLowerCase();
  const password       = validator.trim(req.body.password);
  const rePassword     = validator.trim(req.body.re_password);
  const invitationCode = validator.trim(req.body.invitation_code);

  const ep = new eventproxy();  //这一段不是很明白，待定
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.status(422);
    res.render('sign/signup', {error: msg, loginname: loginName, email: email});
  });

  // 验证信息的正确性
  if ([loginName, password, rePassword, email].some(function (item) {
      return item === '';
    })) {
    ep.emit('prop_err', '信息不完整。');
    return;
  }
  if (loginName.length < 5) {
    ep.emit('prop_err', '用户名至少需要5个字符。');
    return;
  }
  if (!tools.validateId(loginName)) {
    return ep.emit('prop_err', '用户名不合法。');
  }
  if (!validator.isEmail(email)) {
    return ep.emit('prop_err', '邮箱不合法。');
  }
  if (password !== rePassword) {
    return ep.emit('prop_err', '两次密码输入不一致。');
  }
  if (!invitationCode) {
    return ep.emit('prop_err', '请填写邀请码。');
  }
  // END 验证信息的正确性


  User.getUsersByQuery({
    '$or': [
      {'loginName': loginName},
      {'email': email}
    ]
  }, {}, function (err, users) {
    if (err) {
      return next(err);
    }

    if (users.length > 0) {
      ep.emit('prop_err', '用户名或邮箱已被使用。');
      return;
    }

    InvitationCode.hasInvitationCode(invitationCode, function(err, code){
      if (err) {
        return next(err);
      }

      if (!code) {
        ep.emit('prop_err', '邀请码已被使用或不不存在');
         return;
       }
      
      tools.bhash(password, ep.done(function (passhash) {
      console.log(passhash);
      User.newAndSave(loginName, loginName, passhash, email, function (err) {
        if (err) {
          return next(err);
        }

        InvitationCode.updateInvitationCodeToUsed(invitationCode, loginName, function(err){
          if (err) {
            return next(err);
          }
        });

        res.render('sign/signup', {
          success: '欢迎加入'
        });
      });

    }));

    })
    
    
  });
};

/**
 * Show user login page.
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */

exports.showLogin = function (req, res) {
  res.render('sign/signin');
};



  /**
   * define some page when login just jump to the home page
   * @type {Array}
   */
  const notJump = [
    '/signup',         //regist page
  ];

  /**
   * Handle user login.
   */
  exports.login = function (req, res, next) {
    const loginName = validator.trim(req.body.loginname).toLowerCase();
    const password  = validator.trim(req.body.password);
    const ep        = new eventproxy();

    ep.fail(next);

    if (!loginName || !password) {
      res.status(422);
      return res.render('sign/signin', { error: '信息不完整。' });
    }

    let getUser;
    if (loginName.indexOf('@') !== -1) {
      getUser = User.getUserByMail;
    } else {
      getUser = User.getUserByLoginName;
    }

    ep.on('login_error', function (login_error) {
      res.status(403);
      res.render('sign/signin', { error: '用户名或密码错误' });
    });

    getUser(loginName, function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return ep.emit('login_error');
      }
      const passhash = user.password;
      tools.bcompare(password, passhash, ep.done(function (bool) {
        if (!bool) {
          return ep.emit('login_error');
        }
        // store session cookie
        authMiddleWare.gen_session(user, res);
        //check at some page just jump to home page
        let refer = req.session._loginReferer || '/user/' + loginName;
        for (let i = 0, len = notJump.length; i !== len; ++i) {
          if (refer.indexOf(notJump[i]) >= 0) {
            refer = '/user/' + loginName;
            break;
          }
        }
        res.redirect(refer);
      }));
    });
  };

// sign out
  exports.signout = function (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    res.redirect('/signin');
  };