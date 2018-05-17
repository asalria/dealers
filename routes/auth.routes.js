const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');
const secmiddleware = require('../middlewares/security.middleware');


router.get('/login', authController.login);
router.post('/login', authController.doLogin);
router.get('/signup', authController.signup);
router.post('/signup',  authController.doSignup);
router.post('/auth/fb', passport.authenticate('fb-auth', { scope: ['email'] }));
router.post('/auth/google', passport.authenticate('google-auth', { scope: ['openid', 'profile', 'email']}));
router.get('/auth/:provider/cb', authController.loginWithProviderCallback)

router.get('/logout', authController.logout);

module.exports = router;
