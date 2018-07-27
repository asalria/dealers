const mongoose = require('mongoose');
const Dealer = require('../models/dealer.model');
const User = require('../models/user.model');
const passport = require('passport');
var request = require('request');
var rp = require('request-promise');
const ApiError = require('../models/api-error.model');

const axios = require('axios');

module.exports.show = (req, res, next) => {

    Dealer.find()
    .then(dealers => {
        console.log(dealers);
        res.render('dealers/show', {
            dealers: dealers
        });
    });
}

module.exports.show2 = (req, res, next) => {

    Dealer.find()
    .then(dealers => {
        console.log(dealers);
        console.log(dealers);
        res.status(200).json({ dealers });
    });
}

module.exports.searchRedirect = (req, res, next) => {

    res.redirect('/');
}

module.exports.list = (req,res,next) => {
    console.log(req.session);
    Dealer.find()
    .then(dealers => {
        console.log(dealers);
        res.render('dealers/list', {
            dealers: dealers
        });
    });
}

module.exports.search2 = (req, res, next) => {
    const googleMapsClient = require('@google/maps').createClient({
        key: process.env.GOOGLE_MAPS,
        Promise: Promise
      });
      var limit = req.query.limit || 10;

      // get the max distance or set it to 8 kilometers
      var maxDistance = req.query.distance || 80;
  
      // we need to convert the distance to radians
      // the raduis of Earth is approximately 6371 kilometers
      maxDistance /= 6371;
    
        googleMapsClient.geocode({address: req.body.search})
        .asPromise()
        .then((response) => {
          var coords = [];
         coords[0] = response.json.results[0].geometry.location.lat;
        coords[1] = response.json.results[0].geometry.location.lng;
        var METERS_PER_MILE = 1609.34;
        Dealer.find({ startPoint: {
            $nearSphere: 
            { $geometry: 
                { type: "Point", 
                  coordinates: coords 
                },
                 $maxDistance: 5 * METERS_PER_MILE 
            }
        }
        }).then(dealers => {
          //  console.log(dealers);
            res.redirect("/");
        });
        
    }).catch((err) => {
        console.log(err);
      });

    
  }
  module.exports.search = (req, res, next) => {
    const googleMapsClient = require('@google/maps').createClient({
        key: process.env.GOOGLE_MAPS,
        Promise: Promise
      });
      var limit = req.query.limit || 10;

      // get the max distance or set it to 8 kilometers
      var maxDistance = req.query.distance || 80;
  
      // we need to convert the distance to radians
      // the raduis of Earth is approximately 6371 kilometers
      maxDistance /= 6371;
    
    Dealer.find()
    .then(routes => {
        googleMapsClient.geocode({address: req.params.search})
        .asPromise()
        .then((response) => {
          var coords = [];
         coords[0] = response.json.results[0].geometry.location.lat;
         coords[1] = response.json.results[0].geometry.location.lng;
         Dealer.find(
            {"startPoint" : {
                "$nearSphere": {
                    "$geometry": {
                        "type": "Point", "coordinates": coords
                    },
                "$maxDistance": maxDistance/* 124.274238 miles */
            
                }
            }
        }).then(dealers => {
            global.dealers = dealers2;
            console.log("DEALERS");
            console.log(dealers);
            res.render('dealers/list', { dealers: JSON.stringify(dealers) });
        });
    })
    .catch(error => next(error));

}).catch(error => next(error));
    
}

module.exports.searchDealer = (req, res, next) => {
    Dealer.find({name: new RegExp(req.body.name, "i")})
    .then(dealers => {
        res.render('dealers/list', { dealers: dealers });
    }).catch(error => next(error));
    
}

module.exports.showOne = (req, res, next) => {
    console.log(req.session);
    Dealer.findById(req.params.id).then((dealer) => { 
        res.render('dealers/showOne', { dealer: dealer });
       }).catch(error => next(error));
}

module.exports.delete = (req, res, next) => {
    Dealer.findByIdAndRemove(req.params.id)
    .then((dealer) => {
         res.redirect('/profile');
       }); 
}

module.exports.edit = (req, res, next) => {
    Dealer.findById(req.params.id)
    .then((dealer) => {
        console.log(dealer);
         res.render('dealers/edit', {
           dealer: dealer
         });
       }); 
}

module.exports.doEdit = (req, res, next) => {
    var coord0 = parseFloat(req.body.lat);
    var coord1 = parseFloat(req.body.lon);
    console.log(req.body);
      aux = {
          name: req.body.name,
          address: req.body.address,
          email: req.body.email,
          emailapp: req.body.emailapp,
          type: req.body.type,
          hours: req.body.hours,
          hoursweekend: req.body.hoursweekend,
          contact: req.body.contact,
          phone: req.body.phone,
          phoneaux: req.body.phoneaux,
          comments: req.body.comments,
          startPoint: {
              type: "Point",
              coordinates: [coord0,coord1]
          }
      };

      dealer2 = new Dealer(aux);
    Dealer.findByIdAndUpdate(req.params.id, aux)
      .then(() => {
        res.redirect('/list');
      }).catch(error => next(new ApiError('Dealer not registered', 500)));

}


module.exports.create = (req, res, next) => {
    res.render('dealers/new'); 
}

module.exports.doCreate = (req, res, next) => {
    console.log(req.body);

    Dealer.findOne({ email: req.body.email })
      .then(dealer => {
        if (dealer) {

          next(new ApiError('Dealer already registered', 400));
        } else {
        var coord0 = parseFloat(req.body.lat);
        var coord1 = parseFloat(req.body.lon);
          aux = {
              name: req.body.name,
              address: req.body.address,
              email: req.body.email,
              emailapp: req.body.emailapp,
              type: req.body.type,
              hours: req.body.hours,
              hoursweekend: req.body.hoursweekend,
              contact: req.body.contact,
              phone: req.body.phone,
              phoneaux: req.body.phoneaux,
              comments: req.body.comments,
              startPoint: [coord0,coord1]

          };

          dealer2 = new Dealer(aux);

          Dealer.init().then(() => {
            dealer2.save()
            .then(() => {
              res.redirect('/list');
            });
        }).catch(error => console.log(error));
          
  
         
          
           
        }
      }).catch(error => console.log(error));

}

function waitForIndex() {
    return new Promise((resolve, reject) => {
        
      Dealer.on('index', error => error ? reject(error) : resolve());
    });
  }