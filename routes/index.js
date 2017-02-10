
module.exports = function (app) {
  app.use('/signin', require('./signin'));
  app.use('/signup', require('./signup'));
};