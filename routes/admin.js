const express = require('express'),
			router  = express.Router();




// renders the add-product.ejs file which comprises the add-product form
router.get('/add-product', (req, res, next) => {
	res.render('add-product');
});

// handles the post requests coming from the add-products form
router.post('/add-product', (req, res, next) => {
  res.send(`<h1>${req.body.title}</h1>`);
});


module.exports = {
  router : router
}
