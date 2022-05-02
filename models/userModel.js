const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username is required'],
    maxlength: [40, 'A name must not exceed 40 characters'],
    minlength: [4, 'A name must not be less than 4'],
    unqiue: true
  },
  email: {
    type: String,
    required: [true, 'The email field is required'],
    unique: true,
    validatate: [validator.isEmail, 'must be a proper email'],
    lowercase: true
  },
  photo: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'the password field is required'],
    minlength: 8,
    select: false
  },

  confirmPassword: {
    type: String,
    minlength: 8,
    required: [true, 'confirm password is required'],
    validate: {
      validator: function(val) {
        return this.password === val;
      },
      message: 'passwords do not match'
    },
    select: false
  },

  passwordChangedAt: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.confirmPassword = undefined;
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified(this.password) || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 5000;
  next();
});

userSchema.pre(/^find/, function(next) {
  //this points to the current query
  this.find({active: {$ne: false}});
  next();
})

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = async function(JWTTimesstamp) {
  

  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    
    return JWTTimesstamp < changedTimeStamp;
  }

  //false mean NOT changed
  return false;
};
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
