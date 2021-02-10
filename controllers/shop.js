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


exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    pageTitle: 'Cart',
    path: '/cart'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};