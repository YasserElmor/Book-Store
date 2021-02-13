const Product = require('../models/product');


exports.getHomePage = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Home Page',
    path: '/'
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("shop/product-list", {
      pageTitle: "Products",
      products: products,
      path: '/products',
      hasProducts: products.length > 0
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByID(prodId, product => {
    res.render('shop/product-details', {
      pageTitle: product.title,
      path: '/products',
      product: product
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart'
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByID(prodId, product => {
    res.render('shop/cart', {
      pageTitle: 'Cart',
      path: '/cart',
      product: product
    });
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};