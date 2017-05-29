const mongoose  = require('mongoose');
const BaseModel = require("./base_model");
const Schema    = mongoose.Schema;

const UserSchema = new Schema({
  nickName: { type: String },
  wechatOpenId: { type: String, index: true, unique: true, sparse: true},
  loginName: { type: String, index: true, unique: true, sparse: true},
  password: { type: String },
  email: { type: String, index: true, unique: true, sparse: true},
  city: { type: String},
  province: { type: String },
  gender: { type: Number},
  avatarUrl: { type: String },
  signature: { type: String },
  profile: { type: String },
  accessToken: { type: String },
  signUpTime : { type: Date }
});

UserSchema.plugin(BaseModel);

// UserSchema.index({loginName: 1}, {unique: true});
// UserSchema.index({email: 1}, {unique: true});
// UserSchema.index({wechatOpenId: 1}, {unique: true});
// UserSchema.index({accessToken: 1});

UserSchema.pre('save', function(next){
  const now = new Date();
  this.update_at = now;
  next();
});

mongoose.model('User', UserSchema);
