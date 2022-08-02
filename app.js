const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const rootDir = require('./util/path');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

//Setting secure headers
const helmet = require('helmet');
app.use(helmet());
//Compressing assets
const compression = require('compression');
app.use(compression());
//Request logging
const accessLogStream = fs.createWriteStream(path.join(rootDir, 'access.log'), {
    flags: 'a'
});
const morgan = require('morgan');
app.use(morgan('combined', {
    stream: accessLogStream
}));

const csrf = require('csurf');
const csrfProtection = csrf();

const multer = require('multer');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const name = new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname;
        cb(null, name);
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image');
app.use(upload);

const flash = require('connect-flash');
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
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

const User = require('./models/user');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error');
const authRoutes = require('./routes/auth');
app.use(express.static(path.join(rootDir, 'public')));
app.use('/images', express.static(path.join(rootDir, 'images')));
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
    console.log(error);
    res.redirect('/500');
});

mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => {
        throw err;
    });