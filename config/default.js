module.exports = {

  // debug 为 true 时，用于本地调试
  debug: true,
  port: 3001,
  session: {
    secret: 'iYearn',
    key: 'iYearn',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/iYearn'
};
