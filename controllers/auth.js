const User = require('../models/user');
exports.getLogin = (req, res, next) => {
    res.render('auth/login',{
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.session.isAuthenticated
    });
};

exports.postLogin =  (req, res, next) => {
    User.findById('62c11d96ebbe898618f5001f')
    .then(user => {
        req.session.user = user;
        req.session.isAuthenticated = true;
        req.session.save(() => { 
            //to prevent redirection before the values are stored in the sessions collection in the database
            res.redirect('/');
        });
    })
    .catch(err => {
        throw err;
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}