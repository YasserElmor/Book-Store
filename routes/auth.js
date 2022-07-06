const express = require('express'),
    router = express.Router(),
    authController = require('../controllers/auth.js');

    router.get('/login', authController.getLogin);
    router.post('/login', authController.postLogin);
    router.post('/logout', authController.postLogout);
    router.get('/signup', authController.getSignup);
    router.post('/signup', authController.postSignup);
    
    module.exports = router;