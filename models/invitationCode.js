const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const InvitationCodeSchema = new Schema({
  invitationCode: { type: String},
  loginName: { type: String},
  isUsed: { type: Boolean }
});

InvitationCodeSchema.pre('save', function(next){
  next();
});

mongoose.model('InvitationCode', InvitationCodeSchema);