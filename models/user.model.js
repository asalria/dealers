const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
        type: String,
        enum : ['USER', 'ADMIN'],
        default : 'ADMIN'
  }
});

userSchema.pre('save', function save(next) {
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }
  
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
            return next();
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
  /*
  userSchema.pre('findOneAndUpdate', function save(next) {
    const user = this;
    if (!user.isModified('password')) {
      return next();
    }
  
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
            return next();
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
  */
  userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
  }

const User = mongoose.model('User', userSchema);
module.exports = User;