const User = require('../models/user.model');
const Dealer = require('../models/dealer.model');
require('isomorphic-fetch');
var fs = require('fs');
var path = require('path');
var prompt = require('prompt');


module.exports.show = (req, res, next) => {
    console.log(req.session);
    User.findById(req.session.currentUser._id)
        .then(user => {
            res.render('user/profile', {
                user: user
            });
        })
        .catch(error => next(error));
}


module.exports.list = (req, res, next) => {
    User.find({})
        .then(users => {
            res.render('user/list', {
                users: users
            });
        })
        .catch(error => next(error));
}

module.exports.editProfile= (req, res, next) => {
  User.findById(req.params.id)
  .then((user) => {
       res.render('user/edit', {
        user: user
       });
     }); 
    }



module.exports.doEdit = (req, res, next) => {
    const userId = req.user._id;
    img = req.file ? req.file.filename : '';
    const updates = {
        username: req.body.username,
        description: req.body.description
    };
    User.findByIdAndUpdate(userId, updates).then((user) => {
      res.redirect('/profile');
    });
};

module.exports.delete = (req, res, next) => {
    const userId = req.params.id;
    User.findByIdAndRemove(userId)
    .then((user) => {
        if (user != "null"){
    
         res.redirect('/user/list');
        } 
       }); 
}

module.exports.makeAdmin = (req, res, next) => {
    const userId = req.params.id;
    User.findByIdAndUpdate(userId, {role : "ADMIN"}).then((user) => {
        res.redirect('/user/list');
                
    });
}

