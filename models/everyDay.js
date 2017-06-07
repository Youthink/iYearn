const mongoose  = require('mongoose');
const BaseModel = require("./base_model");
const Schema    = mongoose.Schema;
const ObjectId  = Schema.ObjectId;

const EveryDaySchema = new Schema({
  userId        : { type: ObjectId },
  TodayDate     : { type: String },
  wakeUpTime    : { type: String },
  sleepTime     : { type: String },
  diary         : { type: String },
  diarySummary  : { type: String }
});

EveryDaySchema.plugin(BaseModel);

EveryDaySchema.pre('save', function(next){
  const now = new Date();
  this.update_at = now;
  next();
});

mongoose.model('EveryDay', EveryDaySchema);

