const express 				 = require('express'),
			router  				 = express.Router();


const products = [];

// renders the add-product.ejs file which comprises the add-product form
router.get('/add-product', (req, res, next) => {
	res.render('add-product', {
		pageTitle: "Add Products"
	});
});

// handles the post requests coming from the add-products form
router.post('/add-product', (req, res, next) => {
	products.push({
		title: req.body.title,
		imageUrl: req.body.imageurl,
		description: req.body.description,
		price: req.body.price
	})
  res.send(`<h1>${products.length}</h1>`
);
});


module.exports = {
  router : router,
	products: products
}
