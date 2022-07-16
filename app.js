const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

const csrf = require('csurf');
const csrfProtection = csrf();

const flash = require('connect-flash');
const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb+srv://admin:01065651408@learningcluster.5febr.mongodb.net/shop?retryWrites=true&w=majority';
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',

});
app.use(session({
    secret: 'some really long string value used to hash our ID',
    resave: false,
    saveUninitialized: false,
    store: store
}));

const path = require('path');
const rootDir = require('./util/path');
const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error');
const authRoutes = require('./routes/auth');
app.use(express.static(path.join(rootDir, 'public')));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    if (!req.session.user) {
        //the conditional would bypass the middleware when the session is destroyed
        //and we don't have access to ID; which happens when we're logged out
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
});

app.use(flash());
app.use(csrfProtection);
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(errorRoutes);

app.use((error, req, res, next) => {
    res.redirect('/500');
});

mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        throw err;
    });