const mongoose  = require('mongoose');
const BaseModel = require("./base_model");
const Schema    = mongoose.Schema;
const ObjectId  = Schema.ObjectId;

const MessageSchema = new Schema({
  master_id: { type: ObjectId},
  author_loginName: { type: String},
  content:   { type: String},
  has_read:  { type: Boolean, default: false },
  create_at: { type: Date, default: Date.now }
});
MessageSchema.plugin(BaseModel);
MessageSchema.index({has_read: -1, create_at: -1});

mongoose.model('Message', MessageSchema);

