const models  = require('../models');
const InvitationCode    = models.InvitationCode;

exports.newAndSave = function (code) {
  const invitationCode            = new InvitationCode();
  invitationCode.invitationCode   = code;
  invitationCode.loginName   = '';
  invitationCode.isUsed    = false;

  invitationCode.save();
};