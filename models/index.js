const mongoose = require('mongoose');
const config = require('config-lite');
const logger = require('../common/logger');

mongoose.connect(config.mongodb, {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', config.mongodb, err.message);
    process.exit(1);
  }
});

// models
require('./user');
require('./invitationCode');
require('./everyDay');
require('./follows');
require('./message');

exports.User    = mongoose.model('User');
exports.InvitationCode = mongoose.model('InvitationCode');
exports.EveryDay = mongoose.model('EveryDay');
exports.Follows = mongoose.model('Follows');
exports.Message = mongoose.model('Message');
