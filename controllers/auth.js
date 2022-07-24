const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
    validationResult
} = require('express-validator');
const crypto = require('crypto');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const catchError500 = require('../util/catchError500');


exports.getLogin = (req, res, next) => {
    try {
        res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: null,
            oldInput: {
                email: '',
                password: ''
            },
            validationErrors: []
        });
    } catch (err) {
        return next(catchError500(err));
    }
};

exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: req.body.email,
                password: req.body.password
            },
            validationErrors: errors.array()
        });
    }
    try {
        const user = await User.findOne({
            email: req.body.email
        });
        req.session.user = user;
        req.session.isAuthenticated = true;
        return req.session.save(() => {
            //to prevent redirection before the values are stored in the sessions collection in the database
            res.redirect('/');
        });
    } catch (err) {
        return next(catchError500(err));
    }
};

exports.postLogout = (req, res, next) => {
    try {
        req.session.destroy(() => {
            res.redirect('/');
        });
    } catch (err) {
        return next(catchError500(err));
    }
};

exports.getSignup = (req, res, next) => {
    try {
        res.render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: null,
            oldInput: {
                email: '',
                password: '',
                confirmPassword: ''
            },
            validationErrors: []
        });
    } catch (err) {
        return next(catchError500(err));
    }
};

exports.postSignup = async (req, res, next) => {
    const {
        email,
        password,
        confirmPassword
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        });
    }
    //12 is a highly secure and efficient value for salting
    try {
        const hashedPass = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPass,
            cart: {
                items: []
            }
        });
        await user.save();
        res.redirect('/login');
        //we're redirecting first since redirecting is not reliant on sending the mail
        return sgMail.send({
            to: email,
            from: 'yasserelmor52@gmail.com', //verified sender by sendgrid
            subject: 'Successfully signed up!',
            html: `
                    <h1> Successfully Signed Up! </h1>
                    `
        });
    } catch (err) {
        return next(catchError500(err));
    }
};

exports.getReset = (req, res, next) => {
    let errMessage = req.flash('error')[0];
    try {
        res.render('auth/reset', {
            path: '/reset',
            pageTitle: 'Reset Password',
            errorMessage: errMessage
        });
    } catch (err) {
        return next(catchError500(err));
    }
};

exports.postReset = (req, res, next) => {
    try {

        const email = req.body.email;
        crypto.randomBytes(32, async (_err, buffer) => {
            const token = buffer.toString('hex');
            const user = await User.findOne({
                email: email
            });
            if (!user) {
                req.flash('error', 'Invalid email');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            //setting the token's expiration date to one hour from now in milliseconds
            user.resetTokenExpiration = Date.now() + 3600000;
            await user.save();
            res.redirect('/');
            await sgMail.send({
                to: email,
                from: 'yasserelmor52@gmail.com', //verified sender by sendgrid
                subject: 'Password Reset',
                html: `
            <p>You requested a password-reset</p>
            <a href = "http://localhost:3000/reset/${token}">Click this link to set a new password</a>
            `
            });
        });
    } catch (err) {
        return next(catchError500(err));
    }
};

exports.getNewPass = async (req, res, next) => {
    try {

        let errMessage = req.flash('error')[0];
        const inputToken = req.params.token;
        const user = await User.findOne({
            resetToken: inputToken,
            resetTokenExpiration: {
                //making sure the token hasn't expired yet
                $gt: Date.now()
            }
        });
        if (!user) {
            return res.redirect('/');
        }
        return res.render('auth/new-password', {
            path: '/reset',
            pageTitle: 'Update Password',
            errorMessage: errMessage,
            //we're passing userId & passwordToken to the view to then pass 
            //it from the view to the post request through the form body
            userId: user._id,
            passwordToken: inputToken
        });
    } catch (err) {
        return next(catchError500(err));
    }
};

exports.postNewPass = async (req, res, next) => {
    try {

        const {
            password: newPassword,
            userId,
            passwordToken
        } = req.body;
        const user = await User.findOne({
            _id: userId,
            resetToken: passwordToken,
            resetTokenExpiration: {
                $gt: Date.now()
            }
        });
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        return res.redirect('/login');
    } catch (err) {
        return next(catchError500(err));
    }
};