const express 				 = require('express'),
			router  				 = express.Router(),
			adminRouter      = require("./admin");


router.get('/', (req, res, next) => {
	const products = adminRouter.products;
	res.render("shop",{
		pageTitle: "Products",
		products: products,
		path: '/',
		hasProducts: products.length > 0
	});
})


module.exports = {
  router : router
}
