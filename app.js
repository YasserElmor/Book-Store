const express = require('express');
const app = express();
const path = require('path');
const rootDir = require('./util/path');
const {mongoConnect} = require('./util/database');
const User = require('./models/user');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error');
app.use(express.static(path.join(rootDir, 'public')));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
    User.findById('62c0079bacd256e791ac8b3f')
    .then(user => {
        //req.user could be accessed anywhere by upcoming middlewares as long as next() is called after storing the value inside it
        //we're creating a new User here to access instance methods, since data retreived from the DB have no access to such methods
        req.user = new User(user.username, user.email, user.cart, user._id);
        //req.locals.user could also be accessed by upcoming middlewares as long as next() is called after storing the value inside it
        /*res.locals.user = user;*/ 
    })
    .catch(err =>{
        throw err;
    }).finally(() => {
        next();
    });
});

app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(errorRoutes);



mongoConnect(() => {
    app.listen(3000);
});
