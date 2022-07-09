const bcrypt = require('bcryptjs');
const User = require('../models/user');
const crypto = require('crypto');

const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
    let errMessage = req.flash('error')[0];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errMessage
    });
};

exports.postLogin = async (req, res, next) => {
    const {
        email,
        password
    } = req.body;
    const user = await User.findOne({
        email: email
    });
    if (!user) {
        req.flash('error', 'Invalid email');
        return res.redirect('/login');
    }
    const truePass = await bcrypt.compare(password, user.password);
    if (truePass) {
        req.session.user = user;
        req.session.isAuthenticated = true;
        return req.session.save(() => {
            //to prevent redirection before the values are stored in the sessions collection in the database
            res.redirect('/');
        });
    }
    req.flash('error', 'Invalid password');
    return res.redirect('/login');
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    let errMessage = req.flash('error')[0];
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errMessage
    });
};

exports.postSignup = async (req, res, next) => {
    const {
        email,
        password,
        confirmPassword
    } = req.body;
    const fetchedUser = await User.findOne({
        email: email
    });
    if (fetchedUser) {
        req.flash('error', 'This email is already registered!');
        return res.redirect('/signup');
    }
    //12 is a highly secure and efficient value for salting
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
        email: email,
        password: hashedPass,
        cart: {
            items: []
        }
    });
    return user.save()
        .then(() => {
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
        })
        .catch(err => {
            throw err;
        });
};

exports.getReset = (req, res, next) => {
    let errMessage = req.flash('error')[0];
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: errMessage
    });
};

exports.postReset = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            return redirect('/reset');
        }
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
};

exports.getNewPass = async (req, res, next) => {
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
};

exports.postNewPass = async (req, res, next) => {
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
};