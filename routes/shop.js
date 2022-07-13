const express = require('express'),
  router = express.Router(),
  shopController = require('../controllers/shop'),
  isAuth = require('../middleware/is-auth');



//renders the index.ejs file which acts as our home page
router.get('/', shopController.getHomePage);

//renders the shop/product-list.ejs file which displays all of our products
router.get('/products', isAuth, shopController.getProducts);

//renders a unique dynamic route that has the product details based on the product ID
router.get('/products/:productId', shopController.getProduct);

//renders the shop/cart.ejs file
router.get('/cart', isAuth, shopController.getCart);

//adds a product to the cart of a user
router.post('/cart', isAuth, shopController.postCart);

//deletes a cart product from the db
router.post('/cart-delete-item', isAuth, shopController.deleteCartProduct);

//renders the shop/checkout.ejs file
router.get('/checkout', isAuth, shopController.getCheckout);

//renders the shop/orders.ejs file
router.get('/orders', isAuth, shopController.getOrders);

//adds an order to the orders collection
router.post('/create-order', isAuth, shopController.postAddOrder);


module.exports = router;