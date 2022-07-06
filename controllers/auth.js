const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
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
    return res.redirect('/login');
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
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
        })
        .catch(err => {
            throw err;
        });
};