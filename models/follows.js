const mongoose  = require('mongoose');
const BaseModel = require("./base_model");
const Schema    = mongoose.Schema;
const ObjectId  = Schema.ObjectId;

const FollowsSchema = new Schema({
  userId        : { type: ObjectId },
  following     : { type: ObjectId },
  create_at: { type: Date, default: Date.now }
});

FollowsSchema.plugin(BaseModel);

FollowsSchema.index({userId: 1, following: 1}, {unique: true});

mongoose.model('Follows', FollowsSchema);

