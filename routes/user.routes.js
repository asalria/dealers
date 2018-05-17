const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const secure = require('../config/passport.config');
const secmiddleware = require('../middlewares/security.middleware');

router.get('/profile', secure.isAuthenticated, userController.show);
router.get('/user/edit/:id', userController.editProfile);
router.post('/user/edit/:id', userController.doEdit);
router.get('/user/list',secure.isAuthenticated, userController.list);
router.get('/user/delete/:id', userController.delete);
router.get('/user/admin/:id', secmiddleware.isAdmin, userController.makeAdmin);


module.exports = router;