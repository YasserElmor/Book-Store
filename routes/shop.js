const express = require('express'),
  router = express.Router(),
  shopController = require('../controllers/shop');



//renders the index.ejs file which acts as our home page
router.get('/', shopController.getHomePage);

//renders the shop/product-list.ejs file which displays all of our products
router.get('/products', shopController.getProducts);

//renders a unique dynamic route that has the product details based on the product ID
router.get('/products/:productId', shopController.getProduct);

//renders the shop/cart.ejs file
router.get('/cart', shopController.getCart);

//sends the product ID in a post request
router.post('/cart', shopController.postCart);

//deletes a cart product from the db
router.post('/cart-delete-item', shopController.deleteCartProduct);

//renders the shop/checkout.ejs file
router.get('/checkout', shopController.getCheckout);

//renders the shop/orders.ejs file
router.get('/orders', shopController.getOrders);

//adds an order to the orders collection
router.post('/create-order', shopController.postAddOrder);


module.exports = router;