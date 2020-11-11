const express          = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      path             = require("path"),
      adminRouter      = require("./routes/admin"),
      shopRouter       = require("./routes/shop");
//////////////////////////////////////////

app.use(bodyParser.urlencoded({extended:true})); //parses the body of incoming requests

app.use('/admin', adminRouter.router); //adds a default root to all requests handled by the admin router
app.use(shopRouter.router);
app.use(express.static(path.join(__dirname,"public"))); //statically accessing the filesystem instead of the routes
app.set('view engine','ejs');


//Error directory
app.use( (req, res, next) => {
  res.status(404).render("error", {pageTitle: "404 Not Found!"});
});


//server setup
app.listen(3000, "127.0.0.1", () => {
  console.log("Server Started!");
});
