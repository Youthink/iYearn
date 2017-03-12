const mongoose  = require('mongoose');
const BaseModel = require("./base_model");
const Schema    = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String},
  loginName: { type: String},
  password: { type: String },
  email: { type: String},
  signature: { type: String },
  profile: { type: String },
  accessToken: {type: String},
});

UserSchema.plugin(BaseModel);

UserSchema.index({loginName: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({accessToken: 1});

UserSchema.pre('save', function(next){
  const now = new Date();
  this.update_at = now;
  next();
});

mongoose.model('User', UserSchema);
