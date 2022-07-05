const express = require('express'),
    router = express.Router(),
    authController = require('../controllers/auth.js');

    router.get('/login', authController.getLogin);
    router.post('/login', authController.postLogin);
    router.post('/logout', authController.postLogout);
    
    module.exports = router;