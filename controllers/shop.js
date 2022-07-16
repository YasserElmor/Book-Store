const Product = require('../models/product');
const Order = require('../models/order');
const catchError500 = require('../util/catchError500');

exports.getHomePage = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Home Page',
        path: '/',
        prods: products,
      });
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({
      userId: req.user._id
    })
    .then(products => {
      res.render("shop/product-list", {
        pageTitle: "Products",
        prods: products,
        path: '/products',
        hasProducts: products.length > 0,
      });
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-details', {
        pageTitle: product.title,
        path: '/products',
        product: product,
      });
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.getCart = ((req, res, next) => {
  return req.user.getCart()
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        products: products,
      });
    })
    .catch(err => {
      return next(catchError500(err));
    });
});


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.deleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  return req.user.deleteProduct(prodId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.postAddOrder = (req, res, next) => {
  return req.user.addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      return next(catchError500(err));
    });
};


exports.getOrders = (req, res, next) => {
  return Order.find({
      'user.userId': req.user._id
    })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders',
        orders: orders,
      });
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.getCheckout = (req, res, next) => {
  try {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
    });
  } catch (err) {
    return next(catchError500(err));
  }
};