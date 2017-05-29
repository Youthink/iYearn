/**
 * Created by DuSong on 2017/4/21.
 */


const _            = require('lodash');
const eventproxy   = require('eventproxy');
const User         = require('../../proxy').User;
const request      = require('request');
const authMiddleWares = require('../../middlewares/auth');

let login = function (req, res, next) {

  const code     = req.body.code;
  const userInfo = req.body.userInfo;
  if(!code){
    return res.json(
      {
        success: false,
        errMessage:'缺少code'
      }
    );
  }

  request.get({
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    json: true,
    qs: {
      grant_type: 'authorization_code',
      appid: process.env.WECHAT_APPID, //你小程序的APPID
      secret: process.env.WECHAT_SECRET, //你小程序的SECRET
      js_code: code
    }
  }, (err, response, data) => {
    if (response.statusCode === 200) {

      const openid = data.openid;
      // const session_key = data.session_key;

      const userObj = {
        nickName     : userInfo.nickName,
        city         : userInfo.city,
        province     : userInfo.province,
        gender       : userInfo.gender,
        avatarUrl    : userInfo.avatarUrl,
        wechatOpenId : openid
      };

      User.getUserByOpenid(openid, function (err, user) {
        if (err) {
          return next(err);
        }
        //没有用户信息，当作注册
        if (!user) {
          return User.newAndSave(userObj, function (err) {
            if (err) {
              return next(err);
            }
            User.getUserByOpenid(openid, function (err, user) {
              if (err) {
                return next(err);
              }
              const cookie = authMiddleWares.gen_session(user,res);
              return res.json({ cookie : cookie });
            });
          });
        }
        //有用户信息
        const cookie = authMiddleWares.gen_session(user,res);
        return res.json({ cookie : cookie });
      });
    } else {
      res.json(err)
    }
  })
};

exports.login = login;

