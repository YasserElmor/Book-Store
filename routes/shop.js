const express = require('express'),
  router = express.Router(),
  shopController = require('../controllers/shop');



//renders the index.ejs file which acts as our home page
router.get('/', shopController.getHomePage);

//renders the shop/product-list.ejs file which displays all of our products
router.get('/products', shopController.getProducts);

//renders the shop/cart.ejs file
router.get('/cart', shopController.getCart);

//renders the shop/checkout.ejs file
router.get('/checkout', shopController.getCheckout);


module.exports = router;