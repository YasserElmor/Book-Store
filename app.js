const express = require('express');
const app = express();
const path = require('path');
const rootDir = require('./util/path');
const {mongoConnect} = require('./util/database');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorRoutes = require('./routes/error');
app.use(express.static(path.join(rootDir, 'public')));
app.set('view engine', 'ejs');

app.use(shopRoutes);
app.use('/admin', adminRoutes);


app.use(errorRoutes);

mongoConnect(() => {
    app.listen(3000);
});
