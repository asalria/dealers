const mongoose = require('mongoose');
const Dealer = require('../models/dealer.model');
const User = require('../models/user.model');
const passport = require('passport');
const ApiError = require('../models/api-error.model');


module.exports.isAuthor = (req, res, next) => {
    Dealer.findById(req.params.id).then((dealer) => {
        if( dealer.author.equals(req.user._id) ){
            next();
        } else {
            res.redirect("/");
        }
      }); 
}

module.exports.isAdmin = (req, res, next) => {
    if(req.session.currentUser){
    console.log(req.user);
    
    User.findById(req.session.currentUser._id).then((user) => {
        if( user.role == "ADMIN" ){
            next();
        } else {
            next(new ApiError('User not authorized', 403));
        }
      }); 
    } else {
        next(new ApiError('User not authorized', 403));
    }
}