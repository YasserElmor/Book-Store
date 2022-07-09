const express = require('express'),
    router = express.Router(),
    authController = require('../controllers/auth.js');

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPass);
router.post('/new-password', authController.postNewPass);
module.exports = router;