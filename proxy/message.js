const eventproxy  = require('eventproxy');
const Message = require('../models').Message;


/**
 * 根据用户ID，获取未读消息的数量
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - count, 未读消息数量
 * @param {String} id 用户ID
 * @param {Function} callback 获取消息数量
 */
exports.getMessagesCount = function (id, callback) {
  Message.count({master_id: id, has_read: false}, callback);
};

/**
 * 根据用户ID，获取未读消息列表
 * Callback:
 * - err, 数据库异常
 * - messages, 未读消息列表
 * @param {String} userId 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUnreadMessageByUserId = function (userId, callback) {
  Message.find({master_id: userId, has_read: false}, null,
    {sort: '-create_at'}, callback);
};


/**f
 * 将消息设置成已读
 */
exports.updateMessagesToRead = function (userId, messages, callback) {
  if (messages.length === 0) {
    return callback();
  }

  const ids = messages.map(function (m) {
    return m.id;
  });

  const query = { master_id: userId, _id: { $in: ids } };
  Message.update(query, { $set: { has_read: true } }, { multi: true }).exec(callback);
};

exports.sendMessage = function (master_id, author_loginName, content, callback) {

  const message = new Message();
  message.author_loginName = author_loginName;
  message.content   = content;
  message.master_id = master_id;
  message.save(callback);

};
