const models  = require('../models');
const InvitationCode    = models.InvitationCode;

exports.newAndSave = function (code) {
  const invitationCode            = new InvitationCode();
  invitationCode.invitationCode   = code;
  invitationCode.loginName   = '';
  invitationCode.isUsed    = false;

  invitationCode.save();
};

/**
 * 查找邀请码是否存在，且未被使用
 */
exports.hasInvitationCode = function (code, callback) {
  if (!code) {
    return callback();
  }
  InvitationCode.findOne({invitationCode: code, isUsed:false}, callback);
};

/**
 * 邀请码设置成已使用
 */
exports.updateInvitationCodeToUsed = function (code, loginName, callback) {
  if (!code) {
    return callback();
  }

  const query = { invitationCode: code};
  InvitationCode.update(query, {$set: {loginName: loginName, isUsed: true}}).exec(callback);
};