const mongoose = require('mongoose');
const User = require('../models/user.model');
const passport = require('passport');
const session = require('express-session');
const ApiError = require('../models/api-error.model');

module.exports.signup = (req, res, next) => {
    res.render('auth/signup');
}

module.exports.doSignup = (req, res, next) => {
    console.log(req.body);
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          next(new ApiError('User already registered', 400));
        } else {
          user = new User(req.body);
          user.save()
            .then(() => {
              res.json(user);
            })
            .catch(error => {
              if (error instanceof mongoose.Error.ValidationError) {
                next(new ApiError(error.message, 400, error.errors));
              } else {
                next(error);
              }
            });
        }
      }).catch(error => next(new ApiError('User already registered', 500)));
  }

module.exports.login = (req, res, next) => {
            res.render('auth/login');
}

module.exports.doLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.render('auth/login', { 
            user: { email: email }, 
            error: {
                password: password ? '' : 'Password is required',
                email: email ? '' : 'Email is required'
            }
        });
    } else {
        User.findOne({ email: email})
            .then(user => {
                errorData = {
                    user: { email: email },
                    error: { password: 'Invalid email or password' }
                }
                if (user) {
                    user.checkPassword(password)
                        .then(match => {
                            if (!match) {
                                res.render('auth/login', errorData);
                            } else {
                                console.log(req.session);
                                req.session.authenticated = true;
                                req.session.currentUser = user;
                                res.redirect('/profile');
                            }
                        })
                        .catch(error => next(error));
                } else {
                    console.log(errorData);
                    res.render('auth/login', errorData);
                }
            }).catch(error => next(error));
    }

}
module.exports.loginWithProviderCallback = (req, res, next) => {
    passport.authenticate(`${req.params.provider}-auth`, (error, user) => {
        if(error) {
            next(error);
        } else {
            req.login(user, (error) => {
                if (error) {
                    next(error);
                } else {
                    res.redirect('/profile');
                }
            });
        }
    })(req, res, next);
}

module.exports.logout = (req, res, next) => {
    req.logout();
    req.session.destroy();

    console.log(req.isAuthenticated()); 
    res.redirect('/');
}