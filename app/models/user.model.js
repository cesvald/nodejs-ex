const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  refreshToken: {
    type: String,
    required: false
  },
  messages: [{
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: false
  }]
}, {
    timestamps: true
});

UserSchema.methods.isValidPassword = async function(password) {
    const compare = await bcrypt.compare(password, this.password);
    return compare;
}

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', UserSchema);