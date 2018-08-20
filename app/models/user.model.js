const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

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
  messages: [{
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: false
  }]
}, {
    timestamps: true
});

UserSchema.pre('save', function(next){
    const hash = bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

UserSchema.methods.isValidPassword = function(password) {
    const compare = bcrypt.compare(password, this.password);
    return compare;
}

UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', UserSchema);