const express = require('express'),
    router = express.Router(),
    authController = require('../controllers/auth.js'),
    User = require('../models/user.js'),
    {
        check
    } = require('express-validator'),
    postSignupValidation = [
        check('email', 'Please enter a valid email')
        .isEmail()
        .custom(async email => {
            const fetchedUser = await User.findOne({
                email: email
            });
            if (fetchedUser) {
                return Promise.reject('This email is already registered!');
            }
            return true;
        }),
        check('password', 'Invalid password: password must be more than 5 characters long')
        .isLength({
            min: 5
        }),
        check('confirmPassword')
        .custom((confirmPassword, {
            req
        }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('the 2 entered passwords do not match!')
            }
            return true;
        })
    ];
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.get('/signup', authController.getSignup);
router.post('/signup', postSignupValidation, authController.postSignup);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPass);
router.post('/new-password', authController.postNewPass);
module.exports = router;