const mongoose  = require('mongoose');
const BaseModel = require("./base_model");
const Schema    = mongoose.Schema;
const ObjectId  = Schema.ObjectId;

const EverySchema = new Schema({
  userId        : { type: ObjectId },
  Date          : { type: String },
  wakeUpTime    : { type: String },
  sleepTime     : { type: String },
  plan          : { type: String },
  summary       : { type: String }
});

EverySchema.plugin(BaseModel);

EverySchema.pre('save', function(next){
  const now = new Date();
  this.update_at = now;
  next();
});

mongoose.model('Every', EverySchema);

