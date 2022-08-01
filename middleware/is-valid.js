const User = require('../models/user'),
    bcrypt = require('bcryptjs'),
    {
        check,
        body
    } = require('express-validator');
const path = require('path');
const Product = require('../models/product');


const postSignupValidation = [
    body('email', 'Please enter a valid email')
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
    body('password', 'Invalid password: password must be more than 5 characters long')
    .isLength({
        min: 5
    }),
    body('confirmPassword')
    .custom((confirmPassword, {
        req
    }) => {
        if (confirmPassword !== req.body.password) {
            throw new Error('the 2 entered passwords do not match!')
        }
        return true;
    })
];

const postLoginValidation = [
    body('email')
    .custom(async (email, {
        req
    }) => {
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            throw new Error('Invalid email!');
        }
        return true;
    })
    .custom(async email => {
        const fetchedUser = await User.findOne({
            email: email
        });
        if (!fetchedUser.isActive) {
            return Promise.reject('Please check your email for a verification link');
        }
        return true;
    }),
    body('password', 'Wrong password!')
    .trim().not().isEmpty()
    .custom(async (password, {
        req
    }) => {
        const user = await User.findOne({
            email: req.body.email
        });
        const truePass = await bcrypt.compare(password, user.password);
        if (!truePass) {
            throw new Error();
        }
        return true;
    })
];

//used for both edit-product & add-product
const postProductValidation = [
    body('title', 'Title should be a string of at least 3 characters')
    .isString()
    .isLength({
        min: 3
    }),
    check('image', 'Please upload an image!')
    .custom((_image, {
        req
    }) => {

        if (!req.file) {
            if (!req.query.edit) {
                return false;
            }
            return true;
        } else {
            extension = (path.extname(req.file.filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                default:
                    return false;
            }
        }
    }),
    body('price', 'please enter a valid price')
    .isFloat(),
    body('description', 'description should be between 5 and 400 characters')
    .isLength({
        min: 5,
        max: 400
    })
];

module.exports.postSignupValidation = postSignupValidation;
module.exports.postLoginValidation = postLoginValidation;
module.exports.postProductValidation = postProductValidation;