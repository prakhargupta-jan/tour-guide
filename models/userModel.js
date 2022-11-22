const { default: mongoose } = require("mongoose");
const validator = require('validator')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { reset } = require("nodemon");


const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Must provide a name"],
  },
  email: {
    type: String,
    required: [true,'Must provide a email'],
    unique: true,
    lower: true,
    validate: [validator.isEmail, 'please provide valid email']
  },
  photo: String,
  password: {
    type: String,
    requried: [true, 'Must provide a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Must provide confirm password'],
    validate: [function(el) {return el===this.password}, 'Passwords are not the same']
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  passwordChangedAt: Date,
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: String,
    select: false
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password'))
    return next();
  this.password = await bcrypt.hash(this.password, 10)
  this.passwordConfirm = undefined;
  next();
})

userSchema.pre('save', async function(next) {
  if (!this.isModifie('password') || this.isNew)
    return next();
  this.passwordChangedAt = Date.now()+1000;
  next();
})

userSchema.pre(/^find/, async function(next) {
  this.find({active: {$ne: false}});
  next();
})

userSchema.methods.checkPassword = async function (receivedPassword) {
  return await bcrypt.compare(receivedPassword, this.password)
}

userSchema.methods.passwordChangedAfter = function (JWTTimestamp)  {
  if (!this.passwordChangedAt)
    return false
  return this.passwordChangedAt.getTime()/1000 > JWTTimestamp;
}

userSchema.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10*60*1000;
  return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
