const express = require('express');
const router = express.Router();
const dealerController = require('../controllers/dealer.controller');
const passport = require('passport');
const secure = require('../config/passport.config');
const secmiddleware = require('../middlewares/security.middleware');

router.get('/', dealerController.show);
router.get('/show', dealerController.show2);
router.get('/dealers/dealer/:id', dealerController.showOne);
router.get('/create', secure.isAuthenticated, dealerController.create);
router.get('/list', dealerController.list);
router.post('/create', dealerController.doCreate);
router.get('/edit/:id', secmiddleware.isAdmin, dealerController.edit);
router.post('/edit/:id', secmiddleware.isAdmin, dealerController.doEdit);
router.get('/delete/:id', dealerController.delete);
router.post('/search', dealerController.search);
router.get('/search', dealerController.searchRedirect);
router.post('/searchdealer', dealerController.searchDealer);
//router.get('/searchdealer', dealerController.searchRedirectDealer);


module.exports = router;

