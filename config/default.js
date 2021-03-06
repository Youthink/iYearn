module.exports = {

  // debug 为 true 时，用于本地调试
  debug: true,
  auth_cookie_name: 'iYearn',
  admins: { user_login_name: true },

  port: 3000,
  session: {
    secret: 'iYearn',
    key: 'iYearn',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://king:IYearn_2017%40Hufy@db:27017/iYearn'
};
