const express = require('express'),
  router = express.Router(),
  shopController = require('../controllers/shop'),
  isAuth = require('../middleware/is-auth');



router.get('/', shopController.getHomePage);

router.get('/products', isAuth, shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.deleteCartProduct);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

router.post('/create-order', isAuth, shopController.postAddOrder);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);


module.exports = router;